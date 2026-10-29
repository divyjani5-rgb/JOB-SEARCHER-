import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceMiles,
  calculateSkillMatchScore,
  normalizeSkill,
  formatSalary,
  filterJobsByRadiusAndSkills,
  type Job,
} from './jobMatching';

test('calculateDistanceMiles: returns 0 for same point', () => {
  const dist = calculateDistanceMiles(30.2672, -97.7431, 30.2672, -97.7431);
  assert.equal(dist, 0);
});

test('calculateDistanceMiles: approximates distance between Austin and San Antonio (~75-80 miles)', () => {
  // Austin: 30.2672, -97.7431
  // San Antonio: 29.4241, -98.4936
  const dist = calculateDistanceMiles(30.2672, -97.7431, 29.4241, -98.4936);
  assert.ok(dist >= 70 && dist <= 85, `Expected 70-85 miles, got ${dist}`);
});

test('normalizeSkill: handles C#, C++, and lowercase', () => {
  assert.equal(normalizeSkill('C#'), 'csharp');
  assert.equal(normalizeSkill('C++'), 'cplusplus');
  assert.equal(normalizeSkill('Node.js'), 'nodejs');
  assert.equal(normalizeSkill('React.js'), 'reactjs');
});

test('calculateSkillMatchScore: returns 100 when all skills matched', () => {
  const user = ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'];
  const job = ['React', 'TypeScript', 'Tailwind CSS'];
  const score = calculateSkillMatchScore(user, job);
  assert.equal(score, 100);
});

test('calculateSkillMatchScore: returns 0 when no skills match', () => {
  const user = ['Photoshop', 'Graphic Design'];
  const job = ['Kubernetes', 'Docker', 'Go'];
  const score = calculateSkillMatchScore(user, job);
  assert.equal(score, 0);
});

test('formatSalary: formats thousands nicely', () => {
  assert.equal(formatSalary(90000, 130000), '$90k - $130k / yr');
  assert.equal(formatSalary(0, 0), 'Competitive');
});

test('formatSalary: formats international currencies (GBP, EUR, JPY, INR)', () => {
  assert.equal(formatSalary(75000, 110000, '£'), '£75k - £110k / yr');
  assert.equal(formatSalary(70000, 95000, '€'), '€70k - €95k / yr');
  assert.equal(formatSalary(8000000, 12000000, '¥'), '¥8M - ¥12M / yr');
  assert.equal(formatSalary(1800000, 3200000, '₹'), '₹1.8M - ₹3.2M / yr');
});

test('filterJobsByRadiusAndSkills: filters out jobs beyond radius and ranks by match', () => {
  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Local Dev',
      company: 'TechCorp',
      location: 'Downtown Austin',
      city: 'Austin',
      lat: 30.27,
      lng: -97.74,
      type: 'Full-time',
      salaryMin: 100000,
      salaryMax: 140000,
      currency: '$',
      skills: ['React', 'TypeScript'],
      description: 'Downtown role',
      postedDate: '2026-10-25',
      source: 'direct',
    },
    {
      id: '2',
      title: 'Far Away Dev',
      company: 'FarCorp',
      location: 'Dallas',
      city: 'Dallas',
      lat: 32.7767,
      lng: -96.797,
      type: 'Full-time',
      salaryMin: 110000,
      salaryMax: 150000,
      currency: '$',
      skills: ['React', 'TypeScript'],
      description: 'Dallas role',
      postedDate: '2026-10-25',
      source: 'direct',
    },
  ];

  // User in Austin (30.2672, -97.7431) with 25 mile radius
  const filtered = filterJobsByRadiusAndSkills(
    sampleJobs,
    30.2672,
    -97.7431,
    25,
    ['React', 'TypeScript'],
    50
  );

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, '1');
  assert.equal(filtered[0].matchScore, 100);
});
