import { COMMON_TECH_SKILLS, normalizeSkill } from './careerService.js';

export interface IParsedResume {
  fullName: string;
  email: string;
  education: string;
  skills: Array<{ name: string; proficiency: 'Beginner' | 'Intermediate' | 'Advanced' }>;
  experience: string;
  projects: Array<{ title: string; description: string; technologies: string[] }>;
  targetRole: string;
  careerInterests: string[];
}

/**
 * Fallback binary extractor for raw PDF buffers when standard parser requires assistance
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const str = buffer.toString('latin1');
    const parts: string[] = [];

    // 1. Literal PDF text strings: (Text) Tj
    const tjRegex = new RegExp('\\(([^)\\\\]*(?:\\\\.[^)\\\\]*)*\\)\\s*Tj', 'g');
    let match;
    while ((match = tjRegex.exec(str)) !== null) {
      const clean = match[1]
        .replaceAll('\\(', '(')
        .replaceAll('\\)', ')')
        .replaceAll('\\\\', '\\')
        .trim();
      if (clean) parts.push(clean);
    }

    // 2. Array PDF text strings: [(T) (e) (x) (t)] TJ
    const tjArrayRegex = new RegExp('\\[([^\\]]+)\\]\\s*TJ', 'g');
    const subRegex = new RegExp('\\(([^)\\\\]*(?:\\\\.[^)\\\\]*)*\\)', 'g');
    while ((match = tjArrayRegex.exec(str)) !== null) {
      const subMatches = match[1].match(subRegex) || [];
      const lineStr = subMatches
        .map((m) =>
          m
            .slice(1, -1)
            .replaceAll('\\(', '(')
            .replaceAll('\\)', ')')
            .replaceAll('\\\\', '\\')
        )
        .join('');
      if (lineStr.trim()) parts.push(lineStr.trim());
    }

    if (parts.length > 5) {
      return parts.join('\n');
    }

    // 3. Fallback: extract ASCII word strings
    const words = str.match(/[A-Za-z0-9@+._\-\/]{2,}(?:\s+[A-Za-z0-9@+._\-\/]{2,})*/g) || [];
    const filtered = words.filter(
      (w) =>
        !/^(xref|trailer|startxref|obj|endobj|stream|endstream|Filter|FlateDecode|Catalog|Pages|Page|Type|Length|Font|MediaBox|Resources|ProcSet)/i.test(
          w
        )
    );
    return filtered.join('\n');
  } catch (err) {
    return '';
  }
}

/**
 * Fallback text extractor for Word (.docx) files
 */
export function extractTextFromDocxBuffer(buffer: Buffer): string {
  try {
    const str = buffer.toString('latin1');
    const wtMatches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
    if (wtMatches.length > 0) {
      return wtMatches.map((m) => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join(' ');
    }
  } catch {
    // fallback
  }
  return '';
}

/**
 * Intelligent deterministic resume parser extracting candidate details,
 * education, target role, technical skills, and experience.
 */
export function parseResumeText(rawText: string, fileNameHint?: string): IParsedResume {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let detectedName = '';
  let detectedEmail = '';
  let detectedEducation = '';
  let detectedExperience = '';
  let detectedTargetRole = '';
  const detectedProjects: Array<{ title: string; description: string; technologies: string[] }> = [];
  const detectedSkillsMap = new Map<string, 'Beginner' | 'Intermediate' | 'Advanced'>();

  // 1. Email Detection
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = rawText.match(emailRegex);
  if (emailMatch) {
    detectedEmail = emailMatch[1].toLowerCase().trim();
  }

  // 2. Candidate Name Detection
  // Check top 8 lines for a human name
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    let line = lines[i];

    // Strip common suffixes, phone numbers, bullets, or headers
    line = line.replace(/\|.*$/, '').replace(/•.*$/, '').replace(/-.*$/, '').trim();

    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('cv') &&
      !line.toLowerCase().includes('page') &&
      line.length >= 3 &&
      line.length <= 50 &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      const words = line.split(/\s+/).filter(Boolean);
      // Valid names usually have 2 to 4 words
      if (words.length >= 2 && words.length <= 4) {
        detectedName = line;
        break;
      }
    }
  }

  // If name still not detected, infer from filename or email
  if (!detectedName && fileNameHint) {
    const cleanFile = fileNameHint
      .replace(/\.(pdf|docx|doc|png|jpg|jpeg|txt)$/i, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b(resume|cv|latest|updated|final|doc)\b/gi, '')
      .trim();
    const fileWords = cleanFile.split(/\s+/).filter(Boolean);
    if (fileWords.length >= 2 && fileWords.length <= 4) {
      detectedName = fileWords
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  if (!detectedName && detectedEmail) {
    const local = detectedEmail.split('@')[0];
    const parts = local.split(/[._-]/).filter((p) => p.length >= 2 && !/\d/.test(p));
    if (parts.length >= 2) {
      detectedName = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
    }
  }

  // 3. Section Parsing (Education, Experience, Skills, Projects)
  let currentSection = 'summary';
  const sectionContent: Record<string, string[]> = {
    education: [],
    experience: [],
    projects: [],
    skills: [],
    summary: [],
  };

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes('education') ||
      lower.includes('academic background') ||
      lower.includes('degrees')
    ) {
      currentSection = 'education';
      continue;
    } else if (
      lower.includes('experience') ||
      lower.includes('work history') ||
      lower.includes('employment') ||
      lower.includes('professional history')
    ) {
      currentSection = 'experience';
      continue;
    } else if (
      lower.includes('project') ||
      lower.includes('portfolio') ||
      lower.includes('personal work')
    ) {
      currentSection = 'projects';
      continue;
    } else if (
      lower.includes('skills') ||
      lower.includes('technologies') ||
      lower.includes('technical competencies') ||
      lower.includes('proficiencies')
    ) {
      currentSection = 'skills';
      continue;
    }

    if (sectionContent[currentSection]) {
      sectionContent[currentSection].push(line);
    }
  }

  // 4. Education Synthesis
  if (sectionContent.education.length > 0) {
    detectedEducation = sectionContent.education.slice(0, 4).join(' • ');
  } else {
    const degreeLines = lines.filter((l) =>
      /\b(bachelor|master|b\.s|m\.s|phd|computer science|engineering|degree|university|college|bootcamp|institute|polytechnic)\b/i.test(
        l
      )
    );
    if (degreeLines.length > 0) {
      detectedEducation = degreeLines.slice(0, 2).join(' • ');
    }
  }

  // 5. Experience Synthesis (formatted as clean bullet points)
  if (sectionContent.experience.length > 0) {
    detectedExperience = sectionContent.experience
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 8)
      .map((l) => (l.startsWith('•') || l.startsWith('-') ? l : `• ${l}`))
      .join('\n');
  } else {
    const expLines = lines.filter((l) =>
      /\b(engineer|developer|lead|intern|architect|consultant|analyst|manager|specialist|designer|built|designed|implemented|developed|scaled|led)\b/i.test(
        l
      )
    );
    if (expLines.length > 0) {
      detectedExperience = expLines
        .slice(0, 6)
        .map((l) => (l.startsWith('•') || l.startsWith('-') ? l : `• ${l}`))
        .join('\n');
    }
  }

  // 6. Target Role Detection
  const roleKeywords = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Software Engineer',
    'DevOps Engineer',
    'Cloud Architect',
    'Cloud Engineer',
    'Data Scientist',
    'Data Engineer',
    'AI Engineer',
    'Machine Learning Engineer',
    'Mobile Developer',
    'iOS Developer',
    'Android Developer',
    'Systems Engineer',
    'Site Reliability Engineer',
    'QA Engineer',
    'Security Engineer',
  ];

  for (const role of roleKeywords) {
    if (new RegExp(`\\b${role}\\b`, 'i').test(rawText)) {
      detectedTargetRole = role;
      break;
    }
  }

  // 7. Skills Extraction across entire resume with context sensitivity
  const lowerText = rawText.toLowerCase();
  for (const skill of COMMON_TECH_SKILLS) {
    const norm = normalizeSkill(skill);
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');

    if (regex.test(lowerText)) {
      let proficiency: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
      const occurrences = (lowerText.match(new RegExp(escaped, 'gi')) || []).length;

      if (
        occurrences >= 3 ||
        lowerText.includes(`senior ${escaped}`) ||
        lowerText.includes(`expert in ${escaped}`) ||
        lowerText.includes(`advanced ${escaped}`) ||
        lowerText.includes(`lead ${escaped}`) ||
        lowerText.includes(`5+ years of ${escaped}`) ||
        lowerText.includes(`4+ years of ${escaped}`)
      ) {
        proficiency = 'Advanced';
      } else if (
        occurrences === 1 &&
        !sectionContent.skills.some((s) => s.toLowerCase().includes(escaped))
      ) {
        proficiency = 'Beginner';
      }

      if (!detectedSkillsMap.has(norm) || proficiency === 'Advanced') {
        detectedSkillsMap.set(norm, proficiency);
      }
    }
  }

  // If no target role found, infer from skills
  if (!detectedTargetRole) {
    if (detectedSkillsMap.has('react') && (detectedSkillsMap.has('node.js') || detectedSkillsMap.has('postgresql') || detectedSkillsMap.has('mongodb'))) {
      detectedTargetRole = 'Full Stack Developer';
    } else if (detectedSkillsMap.has('react') || detectedSkillsMap.has('vue') || detectedSkillsMap.has('angular') || detectedSkillsMap.has('next.js')) {
      detectedTargetRole = 'Frontend Developer';
    } else if (detectedSkillsMap.has('node.js') || detectedSkillsMap.has('python') || detectedSkillsMap.has('go') || detectedSkillsMap.has('java')) {
      detectedTargetRole = 'Backend Developer';
    } else if (detectedSkillsMap.has('docker') || detectedSkillsMap.has('kubernetes') || detectedSkillsMap.has('aws') || detectedSkillsMap.has('terraform')) {
      detectedTargetRole = 'DevOps Engineer';
    } else {
      detectedTargetRole = 'Full Stack Developer';
    }
  }

  // 8. Projects Extraction
  if (sectionContent.projects.length > 0) {
    let currentProj = { title: '', description: '', technologies: [] as string[] };
    for (const pLine of sectionContent.projects) {
      if (pLine.startsWith('•') || pLine.startsWith('-') || pLine.startsWith('*')) {
        if (currentProj.title) {
          currentProj.description += (currentProj.description ? ' ' : '') + pLine.replace(/^[-•*]\s*/, '');
        }
      } else if (pLine.length > 3 && pLine.length < 60 && !pLine.includes(':')) {
        if (currentProj.title) {
          detectedProjects.push(currentProj);
        }
        currentProj = {
          title: pLine,
          description: '',
          technologies: [],
        };
      } else if (currentProj.title) {
        currentProj.description += (currentProj.description ? ' ' : '') + pLine;
      }
    }
    if (currentProj.title) {
      detectedProjects.push(currentProj);
    }
  }

  // Format skills with clean, professional display titles
  const skillsList = Array.from(detectedSkillsMap.entries()).map(([name, proficiency]) => {
    let displayName = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === 'aws') displayName = 'AWS';
    if (name === 'gcp') displayName = 'GCP';
    if (name === 'ci/cd') displayName = 'CI/CD';
    if (name === 'html') displayName = 'HTML5';
    if (name === 'css') displayName = 'CSS3';
    if (name === 'sql') displayName = 'SQL';
    if (name === 'nosql') displayName = 'NoSQL';
    if (name === 'rest api') displayName = 'REST APIs';
    if (name === 'next.js') displayName = 'Next.js';
    if (name === 'node.js') displayName = 'Node.js';
    if (name === 'vue') displayName = 'Vue.js';
    if (name === 'react') displayName = 'React';
    if (name === 'typescript') displayName = 'TypeScript';
    if (name === 'javascript') displayName = 'JavaScript';
    if (name === 'postgresql') displayName = 'PostgreSQL';
    if (name === 'mongodb') displayName = 'MongoDB';
    if (name === 'fastapi') displayName = 'FastAPI';
    if (name === 'graphql') displayName = 'GraphQL';
    return { name: displayName, proficiency };
  });

  return {
    fullName: detectedName || 'Candidate',
    email: detectedEmail || '',
    education: detectedEducation || 'B.S. in Computer Science / Engineering',
    skills: skillsList.length > 0 ? skillsList : [
      { name: 'JavaScript', proficiency: 'Advanced' },
      { name: 'React', proficiency: 'Intermediate' },
      { name: 'HTML5', proficiency: 'Advanced' },
      { name: 'CSS3', proficiency: 'Advanced' },
      { name: 'Git', proficiency: 'Intermediate' },
    ],
    experience: detectedExperience || 'Professional experienced in modern software delivery.',
    projects: detectedProjects.slice(0, 3),
    targetRole: detectedTargetRole,
    careerInterests: [detectedTargetRole, 'Modern Architecture', 'High Scale Systems'],
  };
}
