import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const message = String(form.get('message') || '');
    const website = String(form.get('website') || ''); // honeypot

    if (website) {
      return new Response('ok', { status: 200 });
    }

    const to = import.meta.env.MAIL_TO || '';
    const from = import.meta.env.MAIL_FROM || '';
    const resendApiKey = import.meta.env.RESEND_API_KEY || '';

    const html = `<div>
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">${message}</pre>
    </div>`;

    if (resendApiKey && to && from) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: 'Café Veritas — Contact form',
          html
        })
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Resend error:', res.status, text);
        return new Response('Failed to send email', { status: 502 });
      }
    } else {
      console.log('[Contact form]', { name, email, message });
    }

    return new Response(null, {
      status: 303,
      headers: { Location: '/contact/thanks/' }
    });
  } catch (err) {
    console.error('Contact API error', err);
    return new Response('Server error', { status: 500 });
  }
};
