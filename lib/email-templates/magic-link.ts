type Locale = 'en' | 'fr' | 'es'

const content: Record<Locale, { subject: string; heading: string; text: string; cta: string; footer: string }> = {
  en: {
    subject: 'Your IndigoCV sign-in link',
    heading: 'Your login link',
    text: 'Click the button below to log in. This link is valid for 1 hour and can only be used once.',
    cta: 'Log in',
    footer: 'If you did not request this, please ignore this email.',
  },
  fr: {
    subject: 'Votre lien de connexion IndigoCV',
    heading: 'Votre lien de connexion',
    text: 'Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien est valable 1 heure et ne peut être utilisé qu\u2019une seule fois.',
    cta: 'Se connecter',
    footer: 'Si vous n\u2019êtes pas à l\u2019origine de cette demande, ignorez cet email.',
  },
  es: {
    subject: 'Tu enlace de acceso a IndigoCV',
    heading: 'Tu enlace de acceso',
    text: 'Haz clic en el botón de abajo para iniciar sesión. Este enlace es válido durante 1 hora y solo se puede usar una vez.',
    cta: 'Iniciar sesión',
    footer: 'Si no solicitaste este enlace, ignora este correo.',
  },
}

export function getMagicLinkEmail(locale: string, actionUrl: string): { subject: string; html: string } {
  const l = (locale in content ? locale : 'en') as Locale
  const t = content[l]

  const html = `
<div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #111827;">
  <p style="font-size: 18px; font-weight: 700; color: #4f46e5; margin: 0 0 24px 0;">IndigoCV</p>
  <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">${t.heading}</h1>
  <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">${t.text}</p>
  <a href="${actionUrl}" style="display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 10px;">
    ${t.cta} &rarr;
  </a>
  <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0 0;">${t.footer}</p>
</div>`.trim()

  return { subject: t.subject, html }
}
