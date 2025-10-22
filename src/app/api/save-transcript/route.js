import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { generateMarkdown, generateFilename } from '@/utils/generateMarkdown';

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      participantId,
      topic,
      probe,
      stage,
      messages,
      startTime,
      endTime,
    } = data;

    // Validate required fields
    if (!participantId || !topic || !probe || !stage || !messages) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate markdown content
    const markdownContent = generateMarkdown({
      participantId,
      topic,
      probe,
      stage,
      messages,
      startTime: startTime || Date.now(),
      endTime: endTime || Date.now(),
    });

    // Generate filename
    const filename = generateFilename({
      participantId,
      topic,
      probe,
      timestamp: startTime || Date.now(),
    });

    // Create directory structure
    const date = new Date(startTime || Date.now());
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const transcriptDir = join(process.cwd(), 'transcripts', topic, yearMonth);

    // Ensure directory exists
    await mkdir(transcriptDir, { recursive: true });

    // Save markdown file
    const markdownPath = join(transcriptDir, filename);
    await writeFile(markdownPath, markdownContent, 'utf-8');

    // Also save JSON backup
    const jsonFilename = filename.replace('.md', '.json');
    const jsonPath = join(transcriptDir, jsonFilename);
    await writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

    // Return success with file paths
    return new Response(
      JSON.stringify({
        success: true,
        filename,
        path: `transcripts/${topic}/${yearMonth}/${filename}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error saving transcript:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to save transcript',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
