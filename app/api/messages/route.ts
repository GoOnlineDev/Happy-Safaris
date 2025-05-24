import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, subject, message } = body;

    if (!from || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email notification
    const emailResult = await sendEmail({
      to: 'happyafricansafaris@gmail.com',
      subject: 'New Message Received',
      html: emailTemplates.newMessage({ from, subject, message }),
    });

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send notification email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 