'use client'

import { useState } from 'react'
import Link from 'next/link'

const FAQ_ITEMS = [
  {
    question: "Qu'est-ce qu'IndigoCV ?",
    answer: "IndigoCV est un outil en ligne gratuit pour créer des CV professionnels. Remplissez un formulaire simple en plusieurs étapes, personnalisez le design en temps réel et téléchargez votre CV en PDF — le tout en quelques minutes.",
  },
  {
    question: 'Comment fonctionne le générateur de PDF ?',
    answer: "Une fois vos informations saisies, vous accédez à un aperçu en temps réel de votre CV. Vous pouvez personnaliser la mise en page (une ou deux colonnes), les couleurs, la police et la densité du contenu. Le PDF est généré directement dans votre navigateur — aucun traitement serveur nécessaire. Quand le résultat vous convient, téléchargez-le en un clic.",
  },
  {
    question: 'Quelles mises en page et options de personnalisation sont disponibles ?',
    answer: "IndigoCV propose deux mises en page : une colonne unique optimisée pour les ATS (systèmes de suivi des candidatures) et une mise en page moderne à deux colonnes. Vous pouvez choisir parmi plusieurs palettes de couleurs, 8 polices professionnelles et 3 niveaux de densité (compact, normal, aéré). Vous pouvez aussi activer ou désactiver chaque section individuellement.",
  },
  {
    question: 'Le formulaire est-il compliqué à remplir ?',
    answer: "Pas du tout ! Le formulaire est divisé en 9 étapes guidées : photo, informations personnelles, expériences, projets, formation, certifications, compétences, langues et centres d'intérêt. Chaque section est optionnelle sauf les informations personnelles de base — remplissez uniquement ce qui est pertinent pour vous.",
  },
  {
    question: 'Faut-il créer un compte ?',
    answer: "Non. Vous pouvez créer et télécharger un CV sans inscription. Cependant, créer un compte gratuit vous permet de sauvegarder votre travail dans votre dashboard personnel pour y revenir et le modifier plus tard.",
  },
  {
    question: 'Comment fonctionne le dashboard ?',
    answer: "Le dashboard vous permet de gérer deux choses : les profils et les CVs. Les profils sont des ensembles réutilisables d'informations personnelles — créez-en un et utilisez-le pour remplir rapidement plusieurs CVs. Chaque CV est un document indépendant avec sa propre mise en page et son contenu, ce qui vous permet d'adapter différentes versions pour différentes candidatures.",
  },
  {
    question: 'Mon CV est-il compatible ATS ?',
    answer: "Oui. La mise en page colonne unique est spécialement conçue pour la compatibilité ATS. Elle utilise du texte propre et structuré que les systèmes de suivi des candidatures peuvent analyser de manière fiable. Pour une compatibilité maximale, nous recommandons d'utiliser cette mise en page sans photo.",
  },
  {
    question: 'Mes données sont-elles en sécurité ?',
    answer: "Vos données de CV restent dans la session de votre navigateur jusqu'à ce que vous choisissiez de les sauvegarder. Si vous créez un compte, vos données sont stockées de manière sécurisée dans notre base de données. Nous ne partageons ni ne vendons jamais vos informations personnelles.",
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main
      className="min-h-screen flex items-start justify-center px-4 pt-24 pb-10"
      style={{
        background: `
          repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 28px,
            rgba(255, 255, 255, 0.18) 28px,
            rgba(255, 255, 255, 0.18) 30px
          ),
          linear-gradient(
            105deg,
            #ffd6d6 0%,
            #ffddb8 16%,
            #faf7c0 32%,
            #c9efd4 48%,
            #c0e8f7 64%,
            #cdd3f5 80%,
            #e8cef5 100%
          )
        `,
      }}
    >
      <div className="w-full max-w-2xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-base font-bold tracking-tight" style={{ color: '#4f46e5' }}>
              IndigoCV
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">Questions fréquentes</h1>
            <p className="text-sm text-gray-500 mt-1">Tout ce que vous devez savoir sur IndigoCV.</p>
          </div>

          <div className="space-y-2">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-white/60 transition cursor-pointer"
                >
                  <span>{item.question}</span>
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200"
                    style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          <Link href="/" className="hover:underline">← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </main>
  )
}
