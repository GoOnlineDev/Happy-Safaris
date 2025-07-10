import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send email notification to admin
    const emailResult = await sendEmail({
      to: 'happyafricansafaris@gmail.com',
      subject: 'New Newsletter Subscription',
      html: emailTemplates.newSubscriber({ email }),
    });

    if (!emailResult.success) {
      console.error('Failed to send subscription email:', emailResult.error);
      // Don't block the user, just log the error
    }

    // You might want to add the email to a database or a mailing list service here

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 