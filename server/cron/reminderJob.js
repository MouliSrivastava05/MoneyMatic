import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure the email transporter
// In production, you would configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
// For development/testing without credentials, we can use an ethereal account if not provided
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate a test ethereal account if no SMTP provided
    console.log('No SMTP configuration found. Generating a test Ethereal account...');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

const createReminderTemplate = (userName, reminderTitle, amount, dueDate, notes) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">MoneyMatic Reminder</h2>
      <p style="color: #475569; font-size: 16px;">Hi ${userName},</p>
      <p style="color: #475569; font-size: 16px;">This is a friendly reminder that your following item is due in <strong>exactly 2 days</strong>:</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #14b8a6;">
        <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px;">${reminderTitle}</h3>
        ${amount ? `<p style="margin: 5px 0; color: #334155; font-size: 16px;"><strong>Amount Due:</strong> $${Number(amount).toFixed(2)}</p>` : ''}
        <p style="margin: 5px 0; color: #334155; font-size: 16px;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
        ${notes ? `<p style="margin: 10px 0 5px 0; color: #475569; font-style: italic;">"${notes}"</p>` : ''}
      </div>
      
      <p style="color: #475569; font-size: 14px; margin-top: 30px;">Stay on top of your finances with MoneyMatic!</p>
    </div>
  `;
};

// Check for due reminders and send emails
export const processReminders = async () => {
  console.log('Running reminder check...');
  try {
    const today = new Date();
    // Target date is 2 days from now
    const targetDateStart = new Date(today);
    targetDateStart.setDate(targetDateStart.getDate() + 2);
    targetDateStart.setHours(0, 0, 0, 0);
    
    const targetDateEnd = new Date(targetDateStart);
    targetDateEnd.setHours(23, 59, 59, 999);

    const dueReminders = await prisma.reminder.findMany({
      where: {
        isActive: true,
        dueDate: {
          gte: targetDateStart,
          lte: targetDateEnd
        }
      },
      include: {
        user: true
      }
    });

    if (dueReminders.length === 0) {
      console.log('No reminders due in 2 days.');
      return;
    }

    console.log(`Found ${dueReminders.length} reminders due in 2 days. Sending emails...`);
    const transporter = await createTransporter();

    for (const reminder of dueReminders) {
      if (!reminder.user.email) continue;
      
      try {
        const mailOptions = {
          from: '"MoneyMatic Alerts" <noreply@moneymatic.app>',
          to: reminder.user.email,
          subject: `Reminder: ${reminder.title} is due in 2 days`,
          html: createReminderTemplate(
            reminder.user.name, 
            reminder.title, 
            reminder.amount, 
            reminder.dueDate, 
            reminder.notes
          )
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(`Successfully sent reminder email to ${reminder.user.email} for "${reminder.title}"`);
        
        // If using ethereal email for testing, log the URL to preview the email
        if (info.messageId && nodemailer.getTestMessageUrl(info)) {
          console.log(`Preview Email URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
      } catch (emailError) {
        console.error(`Failed to send email to ${reminder.user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error running reminder check:', error);
  }
};

// Initialize the cron job
export const startReminderCronJob = () => {
  // Run this job every day at 8:00 AM
  cron.schedule('0 8 * * *', processReminders);
  console.log('Reminder cron job initialized (Runs daily at 8:00 AM)');
};
