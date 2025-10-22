# Interview Transcripts

This directory contains interview transcripts saved in Markdown format.

## Structure

Transcripts are automatically organized by:
- Topic (adhd, mentalhealth, technostress)
- Date (YYYY-MM)

Example structure:
```
transcripts/
├── adhd/
│   ├── 2025-10/
│   │   ├── P001_20251022_183045_adhd_probe2.md
│   │   ├── P001_20251022_183045_adhd_probe2.json
│   │   ├── P002_20251022_190000_adhd_probe2.md
│   │   └── P002_20251022_190000_adhd_probe2.json
│   └── 2025-11/
├── mentalhealth/
└── technostress/
```

## File Naming Convention

`{participantID}_{YYYYMMDD}_{HHMMSS}_{topic}_probe{number}.md`

Example: `P001_20251022_183045_adhd_probe2.md`

## File Formats

### Markdown Files (.md)
Human-readable conversation transcripts with:
- Frontmatter metadata (participant ID, timestamps, probe info)
- Full conversation transcript
- Session metadata
- Space for manual coding notes

### JSON Files (.json)
Machine-readable backup containing:
- All message objects with timestamps
- Complete metadata
- Useful for automated analysis if needed later

## Privacy & Security

- Participant IDs should not contain personally identifiable information
- Store sensitive transcripts according to institutional data protection policies
- Consider encrypting transcripts at rest for clinical research
- Add `transcripts/**/*.md` and `transcripts/**/*.json` to `.gitignore` if using version control

## Manual Coding

Markdown files are designed for easy manual coding:
1. Open in any text editor
2. Highlight or annotate ASRS symptoms
3. Add notes in the "Notes for Coding" section
4. Track coding in spreadsheet or analysis software
