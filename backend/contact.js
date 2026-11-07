// Kontaktanfragen: Rate-Limit, Mailtext, Versand.
// Prüfregeln kommen aus frontend/js/validate.js (identisch im Browser).

import nodemailer from 'nodemailer';

export { validateContact } from '../frontend/js/validate.js';

/**
 * Einfaches Rate-Limit im Speicher: höchstens `limit` Anfragen pro `windowMs` und Schlüssel (IP).
 * Reicht für einen einzelnen Server-Prozess; bei mehreren Instanzen bräuchte es einen gemeinsamen Speicher.
 */
export function createRateLimiter({ limit = 5, windowMs = 10 * 60 * 1000, now = Date.now } = {}) {
  const hits = new Map();

  const prune = (key, time) => {
    const recent = (hits.get(key) ?? []).filter((t) => time - t < windowMs);
    if (recent.length) hits.set(key, recent);
    else hits.delete(key);
    return recent;
  };

  // Alte Einträge regelmäßig aufräumen, damit die Map nicht wächst
  const timer = setInterval(() => {
    const time = now();
    for (const key of hits.keys()) prune(key, time);
  }, windowMs);
  timer.unref();

  return {
    /** Zählt einen Versuch; false = Limit erreicht */
    hit(key) {
      const time = now();
      const recent = prune(key, time);
      if (recent.length >= limit) return false;
      hits.set(key, [...recent, time]);
      return true;
    },
  };
}

/** Betreff und Klartext der Mail an den Betrieb */
export function formatMail(data) {
  const subject = `Anfrage über die Website: ${data.anliegen || 'Allgemein'} – ${data.name}`;
  const text = [
    'Neue Anfrage über das Kontaktformular',
    '',
    `Name:     ${data.name}`,
    `${data.kontaktart === 'email' ? 'E-Mail:  ' : 'Telefon: '} ${data.kontakt}`,
    `Anliegen: ${data.anliegen || '–'}`,
    '',
    'Nachricht:',
    data.nachricht,
    '',
    '--',
    data.kontaktart === 'email'
      ? 'Antworten Sie direkt auf diese E-Mail, um den Kunden zu erreichen.'
      : 'Der Kunde möchte telefonisch kontaktiert werden.',
  ].join('\n');
  return { subject, text };
}

/**
 * Liefert eine Versandfunktion passend zur Konfiguration.
 * Ohne SMTP_HOST: Entwicklungsmodus – Anfrage nur in der Konsole, nichts wird gespeichert.
 */
export function createSender(env = process.env) {
  if (!env.SMTP_HOST) {
    return {
      mode: 'dev',
      async send(data) {
        const { subject, text } = formatMail(data);
        console.info(`\n[kontakt:dev] Kein SMTP_HOST gesetzt – Anfrage wird nur angezeigt:\nBetreff: ${subject}\n${text}\n`);
      },
    };
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: Number(env.SMTP_PORT) === 465, // 465 = TLS von Anfang an, sonst STARTTLS
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });

  return {
    mode: 'smtp',
    async send(data) {
      const { subject, text } = formatMail(data);
      await transport.sendMail({
        from: env.MAIL_FROM,
        to: env.MAIL_TO,
        replyTo: data.kontaktart === 'email' ? { name: data.name, address: data.kontakt } : undefined,
        subject,
        text,
      });
    },
  };
}
