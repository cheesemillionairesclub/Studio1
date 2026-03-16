// ===== Configuration =====
const SEARCH_API_BASE = 'http://185.209.228.153:8080/search';
const SEARCH_API_PROXY = '/api/search';
const STRIPE_LINKS = {
    'mastering': '/api/create-checkout'
};

// ===== Top 100 Genre-based Pricing (No Exclusive status, in €) =====
const TOP100_GENRE_PRICES = {
    '140 / deep dubstep / grime': 580,
    'afro house': 980,
    'amapiano': 580,
    'ambient / experimental': 480,
    'bass / club': 580,
    'bass house': 770,
    'brazilian funk': 580,
    'breaks / breakbeat / uk bass': 580,
    'dance / electro pop': 780,
    'deep house': 770,
    'dj tools': 580,
    'downtempo': 544,
    'drum & bass': 770,
    'dubstep': 780,
    'electro (classic / detroit / modern)': 430,
    'electronica': 580,
    'funky house': 444,
    'hard dance / hardcore': 477,
    'hard techno': 387,
    'house': 1700,
    'indie dance': 990,
    'jackin house': 570,
    'mainstage': 1070,
    'melodic house & techno': 1310,
    'minimal / deep tech': 830,
    'nu disco / disco': 780,
    'organic house / downtempo': 680,
    'progressive house': 632,
    'psy-trance': 780,
    'tech house': 1870,
    'techno (peak time / driving)': 1870,
    'techno (raw / deep / hypnotic)': 2370,
    'trance (main floor)': 1870,
    'trance (raw / deep / hypnotic)': 1870,
    'trap / wave': 880,
    'uk garage / bassline': 880,
    'new african': 430,
    'new caribbean': 430,
    'new hip-hop': 430,
    'new latin': 430,
    'new pop': 430,
    'new r&b': 430,
};

function getTop100Price(genre) {
    if (!genre) return null;
    const g = genre.toLowerCase().trim();
    // Exact match first
    if (TOP100_GENRE_PRICES[g] !== undefined) return TOP100_GENRE_PRICES[g];
    // Partial match: check if genre contains or is contained in a key
    for (const key in TOP100_GENRE_PRICES) {
        if (g.includes(key) || key.includes(g)) return TOP100_GENRE_PRICES[key];
    }
    return null;
}

function updateTop10Price(genre) {
    const el = document.getElementById('top10-price');
    const genreTag = document.getElementById('top10-genre');
    if (!el) return;
    if (genre) {
        el.textContent = '€920';
        el.classList.remove('genre-pending');
        if (genreTag) {
            genreTag.textContent = genre;
            genreTag.style.display = '';
        }
    } else {
        el.textContent = 'Depends on genre';
        el.classList.add('genre-pending');
        if (genreTag) {
            genreTag.textContent = '';
            genreTag.style.display = 'none';
        }
    }
}

function updateTop100Price(genre) {
    const el = document.getElementById('top100-price');
    const genreTag = document.getElementById('top100-genre');
    if (!el) return;
    const price = getTop100Price(genre);
    if (price !== null) {
        el.textContent = '€' + price.toLocaleString();
        el.classList.remove('genre-pending');
        if (genreTag) {
            genreTag.textContent = genre;
            genreTag.style.display = '';
        }
    } else {
        el.textContent = 'Depends on genre';
        el.classList.add('genre-pending');
        if (genreTag) {
            genreTag.textContent = '';
            genreTag.style.display = 'none';
        }
    }
}

// ===== i18n - Full Translations =====
const translations = {
    en: {
        page_title: 'AlphaStudios - Professional Music Services',
        page_desc: 'Professional mastering, feedback and label submission services for DJs, producers and labels.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'PRICING',
        nav_cta: 'GET STARTED',
        hero_badge: 'Professional Music Services. Real Results.',
        hero_title: 'Professional music services for <span class="text-gradient">DJs</span>, <span class="text-gradient">producers</span> and <span class="text-gradient">labels.</span>',
        hero_subtitle: 'Mastering + Feedback + Labels for just $1.',
        hero_cta_btn: 'GET STARTED',
        feature_no_bots: 'Professional Mastering',
        feature_scheduling: 'Detailed Feedback Reports',
        feature_strategy: 'Label Submission Support',
        feature_guarantee: 'Money-back guarantee',
        upload_badge: 'UPLOAD YOUR TRACK',
        upload_title: 'Upload your track for <span class="text-green">mastering</span>',
        upload_desc: 'Drag & drop or click to upload your audio file.',
        upload_tagline: 'Professional quality. Fast delivery. Affordable pricing.',
        upload_drop_text: 'Drag & drop your audio file here',
        upload_drop_hint: 'or click to browse — WAV, AIFF, MP3, FLAC (max 100MB)',
        choose_validate_track: 'Please upload a track first before choosing a package.',
        pricing_badge: 'PRICING',
        pricing_title: 'Choose Your <span class="text-green">Package</span>',
        pricing_desc: 'Professional music services including mastering, feedback and label submission support — all for just $1.',
        choose_btn: 'Choose',
        popular_badge: 'POPULAR',
        change_track: 'Change',
        campaign_badge: 'LET\'S GET INTO DETAILS',
        campaign_title: 'Order Setup',
        campaign_desc: 'Configure your order before placing it.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirm the genre detected for your track.',
        campaign_genre_hint_manual: 'Please type your genre below.',
        campaign_genre_input_placeholder: 'Type your genre (e.g. Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirm',
        campaign_confirmed: 'Confirmed',
        campaign_artists_label: 'Similar Artists',
        campaign_artists_hint: 'Enter 3 artists with a similar style to your track — this helps us tailor our feedback and label recommendations.',
        campaign_artists_placeholder: 'Example: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Release Status',
        campaign_release_hint: 'Is your track already released or in pre-order?',
        campaign_released: 'Already Released',
        campaign_preorder: 'Pre-Order',
        campaign_launch_btn: 'Place my order',
        payment_success: 'Payment confirmed!',
        payment_success_sub: 'Your order is being processed. You will receive a confirmation email shortly.\nYou will also receive your deliverables within 24/48 hours.',
        payment_success_whatsapp_text: "If you'd like to discuss your track, ask a question, or simply stay updated about your order, feel free to reach out.",
        payment_success_whatsapp_btn: 'Chat with us',
        campaign_tips_title: 'Tips / Requirements',
        card_tooltip_title: 'Tips & Requirements',
        campaign_tip_1: 'For best results, submit high-quality audio files.',
        campaign_tip_2: 'Include any specific notes or preferences for the mastering engineer.',
        campaign_tip_5: 'Mastering: We recommend submitting unmastered mixes for the best results.',
        campaign_tip_6: 'Feedback: Our team provides detailed, actionable feedback on your track.',
        campaign_tip_7: 'Labels: We help identify and submit to labels that match your style.',
        campaign_tip_8: 'Delivery: Most orders are completed within 24-48 hours.',
        dailypush_tip_1: 'You can place additional orders at any time for more tracks.',
        dailypush_tip_2: 'Each order includes mastering, professional feedback, and label submission support.',
        dailypush_tip_3: 'Our team works with a wide range of genres and styles.',
        top100_tooltip_title: 'To get the best results from our services, please ensure:',
        top100_tip_1: 'Your track is a high-quality mix ready for mastering.',
        top100_tip_2: 'You provide any specific preferences or reference tracks.',
        top100_tip_3: 'Your contact information is up to date.',
        top100_tip_4: 'You have the rights to the track being submitted.',
        top100_tip_5: 'The audio file is in WAV or AIFF format for best mastering results.',
        top100_tip_6: 'Any notes about your target labels or desired sound are included.',
        top100_tip_7: 'Orders placed on weekends may take slightly longer to process.',
        top10_tooltip_title: 'For our premium services, please ensure:',
        top10_tip_1: 'Your track is fully mixed and ready for mastering.',
        top10_tip_2: 'You have included reference tracks if applicable.',
        top10_tip_3: 'Your artist profile is complete with bio and photo.',
        top10_tip_4: 'You have specified your target labels or genres.',
        top10_tip_footer_1: 'If you need additional services, you can explore our',
        top10_tip_footer_daily_push: 'standard package',
        top10_tip_footer_2: 'designed to give your track professional mastering and feedback.',
        top10_tip_footer_3: 'Our team will guide you through the entire process from mastering to label submission.',
        campaign_validate_genre: 'Please confirm the genre of your track before placing your order.',
        campaign_validate_artists: 'Please enter at least 1 similar artist.',
        choose_validate_track: 'Please select a track first before choosing a package.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Package',
        campaign_summary_copies: 'services',
        how_badge: 'OUR PROCESS',
        how_title: 'How AlphaStudios <span class="text-gradient">Works</span>',
        how_step1_title: 'Find Your Track',
        how_step1_desc: 'Search for your track using our search bar.',
        how_step1_detail: 'Select the track you want us to work on.',
        how_step2_title: 'Choose Your Package',
        how_step2_desc: 'Select the service package that fits your needs:',
        how_step2_li1: 'Professional mastering',
        how_step2_li2: 'Detailed feedback',
        how_step2_li3: 'Label submission support',
        how_step2_li4: 'All-in-one for just $1',
        how_step2_detail: 'Our package includes mastering, feedback, and label submission support.',
        how_step3_title: 'We Process Your Order',
        how_step3_desc: 'Our team begins working on your track.',
        how_step3_bullet1: 'AlphaStudios connects your music with professional mastering engineers and industry experts who provide detailed feedback and label recommendations.',
        how_step3_bullet2: 'Our team processes your order and works on delivering high-quality results.',
        how_step4_title: 'Receive Your Deliverables',
        how_step4_desc: 'Once complete, you receive:',
        how_step4_li1: 'Your mastered track',
        how_step4_li2: 'Detailed feedback report',
        how_step4_li3: 'Label submission recommendations',
        how_step4_detail: 'All deliverables are sent to your email within 24-48 hours.',
        how_step5_title: 'Ongoing Support',
        how_step5_desc: 'We are available for follow-up questions and additional services.',
        why_badge: 'WHY ALPHASTUDIOS',
        why_title: 'Why Choose AlphaStudios for Your Music',
        why_subtitle: 'Professional services you can trust',
        why_card1_title: 'Quality Mastering',
        why_card1_text: 'Our mastering engineers deliver radio-ready tracks with professional precision and attention to detail.',
        why_card2_title: 'Professional Feedback',
        why_card2_text: 'Receive detailed, actionable feedback on your tracks from experienced industry professionals who understand what labels are looking for.',
        why_card3_title: 'Label Submission Support',
        why_card3_text: 'We help you identify the right labels for your music and support you through the submission process to maximize your chances of getting signed.',
        faq_title: 'Frequently asked questions',
        faq0a_q: 'What happens after I order?',
        faq0a_a: 'Once your order is placed, you will immediately receive an order confirmation email.<br>The process is fast, simple and fully handled by our team.<br><br><strong>Here\'s what happens next:</strong><br><br>1. <strong>Track review</strong> — Our team reviews your track and prepares it for mastering.<br>2. <strong>Mastering</strong> — Our engineers master your track to professional standards.<br>3. <strong>Feedback report</strong> — We prepare a detailed feedback report on your track.<br>4. <strong>Label recommendations</strong> — We identify suitable labels and prepare submission materials.<br>5. <strong>Delivery</strong> — You receive all deliverables via email within 24-48 hours.<br><br>That\'s it. Sit back and let our team handle the rest.',
        faq0b_q: 'What\'s the refund policy?',
        faq0b_a: 'We work hard to ensure every order is handled with care.<br><br>If your order cannot be fulfilled or deliverables cannot be provided within the announced timeframe, you may request:<br>• A full refund, or<br>• A replacement service<br><br>Simply contact our support team at any time if you have questions or concerns.<br><br>Our goal is always to provide a transparent, reliable and professional service.',
        faq1_q: 'How long does it take?',
        faq1_a: 'Most orders are delivered within 24-48 hours.',
        faq2_q: 'What is included in the service?',
        faq2_a: 'Each order includes professional mastering, detailed feedback, and label submission support.',
        faq3_q: 'Can new artists use the service?',
        faq3_a: 'Yes. We work with artists of all levels, from beginners to established professionals.',
        faq4_q: 'What audio formats do you accept?',
        faq4_a: 'We accept WAV, AIFF, and high-quality MP3 files. WAV or AIFF is recommended for best mastering results.',
        faq5_q: 'Any tips/requirement?',
        cta_title: 'Ready to take your music to the next level?',
        cta_desc: 'Join hundreds of artists using AlphaStudios for professional music services.',
        cta_btn: 'GET STARTED NOW',
        footer_desc: 'Professional music services — Mastering + Feedback + Labels.',
        footer_nav: 'Navigation',
        footer_boost: 'Get started',
        footer_how: 'How it works',
        footer_copy: '&copy; 2026 AlphaStudios. All rights reserved.',
        footer_terms: 'Terms of Use',
    },
    fr: {
        page_title: 'AlphaStudios - Services musicaux professionnels',
        page_desc: 'Services professionnels de mastering, feedback et soumission aux labels pour DJs, producteurs et labels.',
        nav_how: 'COMMENT CA MARCHE',
        nav_pricing: 'TARIFS',
        nav_cta: 'COMMENCER',
        hero_badge: 'Services musicaux professionnels. Des résultats concrets.',
        hero_title: 'Services musicaux professionnels pour <span class="text-gradient">DJs</span>, <span class="text-gradient">producteurs</span> et <span class="text-gradient">labels.</span>',
        hero_subtitle: 'Mastering + Feedback + Labels pour seulement 1$.',
        hero_cta_btn: 'COMMENCER',
        feature_no_bots: 'Mastering professionnel',
        feature_scheduling: 'Rapports de feedback détaillés',
        feature_strategy: 'Support de soumission aux labels',
        feature_guarantee: 'Garantie satisfait ou remboursé',
        upload_badge: 'UPLOADEZ VOTRE TRACK',
        upload_title: 'Uploadez votre track pour le <span class="text-green">mastering</span>',
        upload_desc: 'Glissez-déposez ou cliquez pour uploader votre fichier audio.',
        upload_tagline: 'Qualité professionnelle. Livraison rapide. Prix abordables.',
        upload_drop_text: 'Glissez-déposez votre fichier audio ici',
        upload_drop_hint: 'ou cliquez pour parcourir — WAV, AIFF, MP3, FLAC (max 100MB)',
        choose_validate_track: 'Veuillez d\'abord uploader une track avant de choisir un forfait.',
        pricing_badge: 'TARIFS',
        pricing_title: 'Choisissez Votre <span class="text-green">Forfait</span>',
        pricing_desc: 'Services musicaux professionnels incluant mastering, feedback et support de soumission aux labels — le tout pour seulement 1$.',
        choose_btn: 'Choisir',
        popular_badge: 'POPULAIRE',
        change_track: 'Changer',
        campaign_badge: 'ENTRONS DANS LES DÉTAILS',
        campaign_title: 'Configuration de la commande',
        campaign_desc: 'Configurez votre commande avant de la passer.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirmez le genre détecté pour votre track.',
        campaign_genre_hint_manual: 'Veuillez taper votre genre ci-dessous.',
        campaign_genre_input_placeholder: 'Tapez votre genre (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmer',
        campaign_confirmed: 'Confirmé',
        campaign_artists_label: 'Artistes similaires',
        campaign_artists_hint: 'Entrez 3 artistes au style similaire à votre track — cela nous aide à personnaliser notre feedback et nos recommandations de labels.',
        campaign_artists_placeholder: 'Exemple : Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Statut de la sortie',
        campaign_release_hint: 'Votre track est-elle déjà sortie ou en pré-commande ?',
        campaign_released: 'Déjà sortie',
        campaign_preorder: 'Pré-commande',
        campaign_launch_btn: 'Passer ma commande',
        payment_success: 'Paiement confirmé !',
        payment_success_sub: 'Votre commande est en cours de traitement. Vous recevrez un email de confirmation sous peu.\nVous recevrez également vos livrables sous 24/48H.',
        payment_success_whatsapp_text: "Si vous souhaitez discuter de votre track, poser une question ou simplement rester informé de votre commande, n'hésitez pas à nous contacter.",
        payment_success_whatsapp_btn: 'Discuter avec nous',
        campaign_tips_title: 'Conseils / Prérequis',
        card_tooltip_title: 'Conseils & Prérequis',
        campaign_tip_1: 'Pour de meilleurs résultats, soumettez des fichiers audio de haute qualité.',
        campaign_tip_2: 'Incluez toute note ou préférence spécifique pour l\'ingénieur de mastering.',
        campaign_tip_5: 'Mastering : Nous recommandons de soumettre des mix non masterisés pour de meilleurs résultats.',
        campaign_tip_6: 'Feedback : Notre équipe fournit un feedback détaillé et actionnable sur votre track.',
        campaign_tip_7: 'Labels : Nous aidons à identifier et soumettre aux labels qui correspondent à votre style.',
        campaign_tip_8: 'Livraison : La plupart des commandes sont traitées sous 24-48 heures.',
        dailypush_tip_1: 'Vous pouvez passer des commandes supplémentaires à tout moment pour d\'autres tracks.',
        dailypush_tip_2: 'Chaque commande inclut le mastering, un feedback professionnel et un support de soumission aux labels.',
        dailypush_tip_3: 'Notre équipe travaille avec une large gamme de genres et de styles.',
        top100_tooltip_title: 'Pour obtenir les meilleurs résultats de nos services, veuillez vous assurer que :',
        top100_tip_1: 'Votre track est un mix de haute qualité prêt pour le mastering.',
        top100_tip_2: 'Vous fournissez toute préférence spécifique ou track de référence.',
        top100_tip_3: 'Vos coordonnées sont à jour.',
        top100_tip_4: 'Vous détenez les droits sur la track soumise.',
        top100_tip_5: 'Le fichier audio est au format WAV ou AIFF pour de meilleurs résultats de mastering.',
        top100_tip_6: 'Toute note sur vos labels cibles ou le son souhaité est incluse.',
        top100_tip_7: 'Les commandes passées le week-end peuvent prendre un peu plus de temps à traiter.',
        top10_tooltip_title: 'Pour nos services premium, veuillez vous assurer que :',
        top10_tip_1: 'Votre track est entièrement mixée et prête pour le mastering.',
        top10_tip_2: 'Vous avez inclus des tracks de référence si applicable.',
        top10_tip_3: 'Votre profil artiste est complet avec bio et photo.',
        top10_tip_4: 'Vous avez précisé vos labels ou genres cibles.',
        top10_tip_footer_1: 'Si vous avez besoin de services supplémentaires, vous pouvez explorer notre',
        top10_tip_footer_daily_push: 'forfait standard',
        top10_tip_footer_2: 'conçu pour offrir à votre track un mastering et un feedback professionnels.',
        top10_tip_footer_3: 'Notre équipe vous guidera tout au long du processus, du mastering à la soumission aux labels.',
        campaign_validate_genre: 'Veuillez confirmer le genre de votre track avant de passer commande.',
        campaign_validate_artists: 'Veuillez entrer au moins 1 artiste similaire.',
        choose_validate_track: 'Veuillez d\'abord sélectionner une track avant de choisir un forfait.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Forfait',
        campaign_summary_copies: 'services',
        how_badge: 'NOTRE PROCESSUS',
        how_title: 'Comment AlphaStudios <span class="text-gradient">fonctionne</span>',
        how_step1_title: 'Trouvez votre track',
        how_step1_desc: 'Recherchez votre track via notre barre de recherche.',
        how_step1_detail: 'Sélectionnez la track sur laquelle vous souhaitez que nous travaillions.',
        how_step2_title: 'Choisissez votre forfait',
        how_step2_desc: 'Sélectionnez le forfait qui correspond à vos besoins :',
        how_step2_li1: 'Mastering professionnel',
        how_step2_li2: 'Feedback détaillé',
        how_step2_li3: 'Support de soumission aux labels',
        how_step2_li4: 'Tout-en-un pour seulement 1$',
        how_step2_detail: 'Notre forfait inclut le mastering, le feedback et le support de soumission aux labels.',
        how_step3_title: 'Nous traitons votre commande',
        how_step3_desc: 'Notre équipe commence à travailler sur votre track.',
        how_step3_bullet1: 'AlphaStudios connecte votre musique avec des ingénieurs de mastering professionnels et des experts de l\'industrie qui fournissent un feedback détaillé et des recommandations de labels.',
        how_step3_bullet2: 'Notre équipe traite votre commande et travaille à fournir des résultats de haute qualité.',
        how_step4_title: 'Recevez vos livrables',
        how_step4_desc: 'Une fois terminé, vous recevez :',
        how_step4_li1: 'Votre track masterisée',
        how_step4_li2: 'Rapport de feedback détaillé',
        how_step4_li3: 'Recommandations de soumission aux labels',
        how_step4_detail: 'Tous les livrables sont envoyés par email sous 24-48 heures.',
        how_step5_title: 'Support continu',
        how_step5_desc: 'Nous sommes disponibles pour les questions de suivi et les services supplémentaires.',
        why_badge: 'POURQUOI ALPHASTUDIOS',
        why_title: 'Pourquoi choisir AlphaStudios pour votre musique',
        why_subtitle: 'Des services professionnels de confiance',
        why_card1_title: 'Mastering de qualité',
        why_card1_text: 'Nos ingénieurs de mastering livrent des tracks prêtes pour la radio avec une précision professionnelle et une attention aux détails.',
        why_card2_title: 'Feedback professionnel',
        why_card2_text: 'Recevez un feedback détaillé et actionnable sur vos tracks de la part de professionnels expérimentés de l\'industrie qui comprennent ce que les labels recherchent.',
        why_card3_title: 'Support de soumission aux labels',
        why_card3_text: 'Nous vous aidons à identifier les bons labels pour votre musique et vous accompagnons dans le processus de soumission pour maximiser vos chances d\'être signé.',
        faq_title: 'Questions fréquentes',
        faq0a_q: 'Que se passe-t-il après ma commande ?',
        faq0a_a: 'Dès que votre commande est passée, vous recevrez immédiatement un email de confirmation.<br>Le processus est rapide, simple et entièrement géré par notre équipe.<br><br><strong>Voici ce qui se passe ensuite :</strong><br><br>1. <strong>Examen de la track</strong> — Notre équipe examine votre track et la prépare pour le mastering.<br>2. <strong>Mastering</strong> — Nos ingénieurs masterisent votre track selon les standards professionnels.<br>3. <strong>Rapport de feedback</strong> — Nous préparons un rapport de feedback détaillé sur votre track.<br>4. <strong>Recommandations de labels</strong> — Nous identifions les labels adaptés et préparons les dossiers de soumission.<br>5. <strong>Livraison</strong> — Vous recevez tous les livrables par email sous 24-48 heures.<br><br>C\'est tout. Installez-vous et laissez notre équipe s\'occuper du reste.',
        faq0b_q: 'Quelle est la politique de remboursement ?',
        faq0b_a: 'Nous travaillons dur pour garantir que chaque commande est traitée avec soin.<br><br>Si votre commande ne peut pas être exécutée ou si les livrables ne peuvent pas être fournis dans le délai annoncé, vous pouvez demander :<br>• Un remboursement complet, ou<br>• Un service de remplacement<br><br>Contactez simplement notre équipe support à tout moment si vous avez des questions ou des préoccupations.<br><br>Notre objectif est toujours de fournir un service transparent, fiable et professionnel.',
        faq1_q: 'Combien de temps cela prend-il ?',
        faq1_a: 'La plupart des commandes sont livrées sous 24-48 heures.',
        faq2_q: 'Qu\'est-ce qui est inclus dans le service ?',
        faq2_a: 'Chaque commande inclut le mastering professionnel, un feedback détaillé et un support de soumission aux labels.',
        faq3_q: 'Les nouveaux artistes peuvent-ils utiliser le service ?',
        faq3_a: 'Oui. Nous travaillons avec des artistes de tous niveaux, des débutants aux professionnels confirmés.',
        faq4_q: 'Quels formats audio acceptez-vous ?',
        faq4_a: 'Nous acceptons les fichiers WAV, AIFF et MP3 haute qualité. Le WAV ou AIFF est recommandé pour de meilleurs résultats de mastering.',
        faq5_q: 'Des conseils / prérequis ?',
        cta_title: 'Prêt à passer votre musique au niveau supérieur ?',
        cta_desc: 'Rejoignez des centaines d\'artistes qui utilisent AlphaStudios pour des services musicaux professionnels.',
        cta_btn: 'COMMENCER MAINTENANT',
        footer_desc: 'Services musicaux professionnels — Mastering + Feedback + Labels.',
        footer_nav: 'Navigation',
        footer_boost: 'Commencer',
        footer_how: 'Comment ça marche',
        footer_copy: '&copy; 2026 AlphaStudios. Tous droits réservés.',
        footer_terms: 'Conditions d\'utilisation',
    },
    pt: {
        page_title: 'AlphaStudios - Serviços musicais profissionais',
        page_desc: 'Serviços profissionais de mastering, feedback e submissão a gravadoras para DJs, produtores e labels.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'PREÇOS',
        nav_cta: 'COMEÇAR',
        hero_badge: 'Serviços musicais profissionais. Resultados reais.',
        hero_title: 'Serviços musicais profissionais para <span class="text-gradient">DJs</span>, <span class="text-gradient">produtores</span> e <span class="text-gradient">labels.</span>',
        hero_subtitle: 'Mastering + Feedback + Labels por apenas $1.',
        hero_cta_btn: 'COMEÇAR',
        feature_no_bots: 'Mastering profissional',
        feature_scheduling: 'Relatórios de feedback detalhados',
        feature_strategy: 'Suporte de submissão a gravadoras',
        feature_guarantee: 'Garantia de devolução',
        upload_badge: 'ENVIE SUA TRACK',
        upload_title: 'Envie sua track para <span class="text-green">mastering</span>',
        upload_desc: 'Arraste e solte ou clique para enviar seu arquivo de áudio.',
        upload_tagline: 'Qualidade profissional. Entrega rápida. Preços acessíveis.',
        upload_drop_text: 'Arraste e solte seu arquivo de áudio aqui',
        upload_drop_hint: 'ou clique para navegar — WAV, AIFF, MP3, FLAC (máx 100MB)',
        choose_validate_track: 'Por favor, envie uma track antes de escolher um pacote.',
        pricing_badge: 'PREÇOS',
        pricing_title: 'Escolha Seu <span class="text-green">Pacote</span>',
        pricing_desc: 'Serviços musicais profissionais incluindo mastering, feedback e suporte de submissão a gravadoras — tudo por apenas $1.',
        choose_btn: 'Escolher',
        popular_badge: 'POPULAR',
        change_track: 'Alterar',
        campaign_badge: 'VAMOS AOS DETALHES',
        campaign_title: 'Configuração do pedido',
        campaign_desc: 'Configure seu pedido antes de finalizá-lo.',
        campaign_genre_label: 'Gênero',
        campaign_genre_hint: 'Confirme o gênero detectado para sua track.',
        campaign_genre_hint_manual: 'Por favor, digite seu gênero abaixo.',
        campaign_genre_input_placeholder: 'Digite seu gênero (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Insira 3 artistas com estilo similar ao da sua track — isso nos ajuda a personalizar nosso feedback e recomendações de gravadoras.',
        campaign_artists_placeholder: 'Exemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Status do lançamento',
        campaign_release_hint: 'Sua track já foi lançada ou está em pré-venda?',
        campaign_released: 'Já lançada',
        campaign_preorder: 'Pré-venda',
        campaign_launch_btn: 'Fazer meu pedido',
        payment_success: 'Pagamento confirmado!',
        payment_success_sub: 'Seu pedido está sendo processado. Você receberá um email de confirmação em breve.\nVocê também receberá seus entregáveis em 24/48H.',
        payment_success_whatsapp_text: 'Se você quiser discutir sua track, fazer uma pergunta ou simplesmente acompanhar seu pedido, fique à vontade para entrar em contato.',
        payment_success_whatsapp_btn: 'Fale conosco',
        campaign_tips_title: 'Dicas / Requisitos',
        card_tooltip_title: 'Dicas & Requisitos',
        campaign_tip_1: 'Para melhores resultados, envie arquivos de áudio de alta qualidade.',
        campaign_tip_2: 'Inclua quaisquer notas ou preferências específicas para o engenheiro de mastering.',
        campaign_tip_5: 'Mastering: Recomendamos enviar mixes não masterizados para os melhores resultados.',
        campaign_tip_6: 'Feedback: Nossa equipe fornece feedback detalhado e acionável sobre sua track.',
        campaign_tip_7: 'Gravadoras: Ajudamos a identificar e enviar para gravadoras que combinam com seu estilo.',
        campaign_tip_8: 'Entrega: A maioria dos pedidos é concluída em 24-48 horas.',
        dailypush_tip_1: 'Você pode fazer pedidos adicionais a qualquer momento para mais tracks.',
        dailypush_tip_2: 'Cada pedido inclui mastering, feedback profissional e suporte de submissão a gravadoras.',
        dailypush_tip_3: 'Nossa equipe trabalha com uma ampla variedade de gêneros e estilos.',
        top100_tooltip_title: 'Para obter os melhores resultados dos nossos serviços, certifique-se de que:',
        top100_tip_1: 'Sua track é um mix de alta qualidade pronto para mastering.',
        top100_tip_2: 'Você fornece quaisquer preferências específicas ou tracks de referência.',
        top100_tip_3: 'Suas informações de contato estão atualizadas.',
        top100_tip_4: 'Você possui os direitos da track sendo enviada.',
        top100_tip_5: 'O arquivo de áudio está no formato WAV ou AIFF para melhores resultados de mastering.',
        top100_tip_6: 'Quaisquer notas sobre suas gravadoras alvo ou som desejado estão incluídas.',
        top100_tip_7: 'Pedidos feitos nos finais de semana podem demorar um pouco mais para processar.',
        top10_tooltip_title: 'Para nossos serviços premium, certifique-se de que:',
        top10_tip_1: 'Sua track está totalmente mixada e pronta para mastering.',
        top10_tip_2: 'Você incluiu tracks de referência, se aplicável.',
        top10_tip_3: 'Seu perfil de artista está completo com bio e foto.',
        top10_tip_4: 'Você especificou suas gravadoras ou gêneros alvo.',
        top10_tip_footer_1: 'Se você precisar de serviços adicionais, pode explorar nosso',
        top10_tip_footer_daily_push: 'pacote padrão',
        top10_tip_footer_2: 'projetado para oferecer à sua track mastering e feedback profissionais.',
        top10_tip_footer_3: 'Nossa equipe irá guiá-lo por todo o processo, do mastering à submissão a gravadoras.',
        campaign_validate_genre: 'Por favor, confirme o gênero da sua track antes de fazer o pedido.',
        campaign_validate_artists: 'Por favor, insira pelo menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecione uma track antes de escolher um pacote.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Pacote',
        campaign_summary_copies: 'serviços',
        how_badge: 'NOSSO PROCESSO',
        how_title: 'Como o AlphaStudios <span class="text-gradient">funciona</span>',
        how_step1_title: 'Encontre sua track',
        how_step1_desc: 'Pesquise sua track usando nossa barra de pesquisa.',
        how_step1_detail: 'Selecione a track na qual deseja que trabalhemos.',
        how_step2_title: 'Escolha seu pacote',
        how_step2_desc: 'Selecione o pacote de serviços que atende às suas necessidades:',
        how_step2_li1: 'Mastering profissional',
        how_step2_li2: 'Feedback detalhado',
        how_step2_li3: 'Suporte de submissão a gravadoras',
        how_step2_li4: 'Tudo-em-um por apenas $1',
        how_step2_detail: 'Nosso pacote inclui mastering, feedback e suporte de submissão a gravadoras.',
        how_step3_title: 'Processamos seu pedido',
        how_step3_desc: 'Nossa equipe começa a trabalhar na sua track.',
        how_step3_bullet1: 'AlphaStudios conecta sua música com engenheiros de mastering profissionais e especialistas da indústria que fornecem feedback detalhado e recomendações de gravadoras.',
        how_step3_bullet2: 'Nossa equipe processa seu pedido e trabalha para entregar resultados de alta qualidade.',
        how_step4_title: 'Receba seus entregáveis',
        how_step4_desc: 'Ao concluir, você recebe:',
        how_step4_li1: 'Sua track masterizada',
        how_step4_li2: 'Relatório de feedback detalhado',
        how_step4_li3: 'Recomendações de submissão a gravadoras',
        how_step4_detail: 'Todos os entregáveis são enviados por email em 24-48 horas.',
        how_step5_title: 'Suporte contínuo',
        how_step5_desc: 'Estamos disponíveis para perguntas de acompanhamento e serviços adicionais.',
        why_badge: 'POR QUE ALPHASTUDIOS',
        why_title: 'Por que escolher o AlphaStudios para sua música',
        why_subtitle: 'Serviços profissionais de confiança',
        why_card1_title: 'Mastering de qualidade',
        why_card1_text: 'Nossos engenheiros de mastering entregam tracks prontas para rádio com precisão profissional e atenção aos detalhes.',
        why_card2_title: 'Feedback profissional',
        why_card2_text: 'Receba feedback detalhado e acionável sobre suas tracks de profissionais experientes da indústria que entendem o que as gravadoras procuram.',
        why_card3_title: 'Suporte de submissão a gravadoras',
        why_card3_text: 'Ajudamos você a identificar as gravadoras certas para sua música e apoiamos você no processo de submissão para maximizar suas chances de ser contratado.',
        faq_title: 'Perguntas frequentes',
        faq0a_q: 'O que acontece depois que eu faço o pedido?',
        faq0a_a: 'Assim que seu pedido for feito, você receberá imediatamente um email de confirmação.<br>O processo é rápido, simples e totalmente gerenciado pela nossa equipe.<br><br><strong>Veja o que acontece a seguir:</strong><br><br>1. <strong>Exame da track</strong> — Nossa equipe analisa sua track e a prepara para o mastering.<br>2. <strong>Mastering</strong> — Nossos engenheiros masterizam sua track segundo padrões profissionais.<br>3. <strong>Relatório de feedback</strong> — Preparamos um relatório de feedback detalhado sobre sua track.<br>4. <strong>Recomendações de gravadoras</strong> — Identificamos gravadoras adequadas e preparamos materiais de submissão.<br>5. <strong>Entrega</strong> — Você recebe todos os entregáveis por email em 24-48 horas.<br><br>Só isso. Relaxe e deixe nossa equipe cuidar do resto.',
        faq0b_q: 'Qual é a política de reembolso?',
        faq0b_a: 'Trabalhamos duro para garantir que cada pedido seja tratado com cuidado.<br><br>Se seu pedido não puder ser cumprido ou os entregáveis não puderem ser fornecidos no prazo anunciado, você pode solicitar:<br>• Um reembolso total, ou<br>• Um serviço substituto<br><br>Entre em contato com nossa equipe de suporte a qualquer momento se tiver dúvidas ou preocupações.<br><br>Nosso objetivo é sempre fornecer um serviço transparente, confiável e profissional.',
        faq1_q: 'Quanto tempo leva?',
        faq1_a: 'A maioria dos pedidos é entregue em 24-48 horas.',
        faq2_q: 'O que está incluído no serviço?',
        faq2_a: 'Cada pedido inclui mastering profissional, feedback detalhado e suporte de submissão a gravadoras.',
        faq3_q: 'Novos artistas podem usar o serviço?',
        faq3_a: 'Sim. Trabalhamos com artistas de todos os níveis, de iniciantes a profissionais estabelecidos.',
        faq4_q: 'Quais formatos de áudio vocês aceitam?',
        faq4_a: 'Aceitamos arquivos WAV, AIFF e MP3 de alta qualidade. WAV ou AIFF é recomendado para melhores resultados de mastering.',
        faq5_q: 'Alguma dica / requisito?',
        cta_title: 'Pronto para levar sua música ao próximo nível?',
        cta_desc: 'Junte-se a centenas de artistas que usam o AlphaStudios para serviços musicais profissionais.',
        cta_btn: 'COMEÇAR AGORA',
        footer_desc: 'Serviços musicais profissionais — Mastering + Feedback + Labels.',
        footer_nav: 'Navegação',
        footer_boost: 'Começar',
        footer_how: 'Como funciona',
        footer_copy: '&copy; 2026 AlphaStudios. Todos os direitos reservados.',
        footer_terms: 'Termos de Uso',
    },
    es: {
        page_title: 'AlphaStudios - Servicios musicales profesionales',
        page_desc: 'Servicios profesionales de mastering, feedback y envío a sellos para DJs, productores y sellos.',
        nav_how: 'CÓMO FUNCIONA',
        nav_pricing: 'PRECIOS',
        nav_cta: 'EMPEZAR',
        hero_badge: 'Servicios musicales profesionales. Resultados reales.',
        hero_title: 'Servicios musicales profesionales para <span class="text-gradient">DJs</span>, <span class="text-gradient">productores</span> y <span class="text-gradient">sellos.</span>',
        hero_subtitle: 'Mastering + Feedback + Labels por solo $1.',
        hero_cta_btn: 'EMPEZAR',
        feature_no_bots: 'Mastering profesional',
        feature_scheduling: 'Informes de feedback detallados',
        feature_strategy: 'Soporte de envío a sellos',
        feature_guarantee: 'Garantía de devolución',
        upload_badge: 'SUBE TU TRACK',
        upload_title: 'Sube tu track para <span class="text-green">mastering</span>',
        upload_desc: 'Arrastra y suelta o haz clic para subir tu archivo de audio.',
        upload_tagline: 'Calidad profesional. Entrega rápida. Precios accesibles.',
        upload_drop_text: 'Arrastra y suelta tu archivo de audio aquí',
        upload_drop_hint: 'o haz clic para explorar — WAV, AIFF, MP3, FLAC (máx 100MB)',
        choose_validate_track: 'Por favor, sube una track antes de elegir un paquete.',
        pricing_badge: 'PRECIOS',
        pricing_title: 'Elige Tu <span class="text-green">Paquete</span>',
        pricing_desc: 'Servicios musicales profesionales que incluyen mastering, feedback y soporte de envío a sellos — todo por solo $1.',
        choose_btn: 'Elegir',
        popular_badge: 'POPULAR',
        change_track: 'Cambiar',
        campaign_badge: 'ENTREMOS EN DETALLES',
        campaign_title: 'Configuración del pedido',
        campaign_desc: 'Configura tu pedido antes de realizarlo.',
        campaign_genre_label: 'Género',
        campaign_genre_hint: 'Confirma el género detectado para tu track.',
        campaign_genre_hint_manual: 'Por favor, escribe tu género a continuación.',
        campaign_genre_input_placeholder: 'Escribe tu género (ej: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Ingresa 3 artistas con estilo similar al de tu track — esto nos ayuda a personalizar nuestro feedback y recomendaciones de sellos.',
        campaign_artists_placeholder: 'Ejemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Estado del lanzamiento',
        campaign_release_hint: '¿Tu track ya fue lanzada o está en preventa?',
        campaign_released: 'Ya lanzada',
        campaign_preorder: 'Preventa',
        campaign_launch_btn: 'Realizar mi pedido',
        payment_success: '¡Pago confirmado!',
        payment_success_sub: 'Tu pedido se está procesando. Recibirás un email de confirmación en breve.\nTambién recibirás tus entregables en 24/48H.',
        payment_success_whatsapp_text: 'Si deseas hablar sobre tu track, hacer una pregunta o simplemente mantenerte informado sobre tu pedido, no dudes en contactarnos.',
        payment_success_whatsapp_btn: 'Chatea con nosotros',
        campaign_tips_title: 'Consejos / Requisitos',
        card_tooltip_title: 'Consejos & Requisitos',
        campaign_tip_1: 'Para mejores resultados, envía archivos de audio de alta calidad.',
        campaign_tip_2: 'Incluye cualquier nota o preferencia específica para el ingeniero de mastering.',
        campaign_tip_5: 'Mastering: Recomendamos enviar mezclas sin masterizar para mejores resultados.',
        campaign_tip_6: 'Feedback: Nuestro equipo proporciona feedback detallado y accionable sobre tu track.',
        campaign_tip_7: 'Sellos: Ayudamos a identificar y enviar a sellos que coincidan con tu estilo.',
        campaign_tip_8: 'Entrega: La mayoría de los pedidos se completan en 24-48 horas.',
        dailypush_tip_1: 'Puedes realizar pedidos adicionales en cualquier momento para más tracks.',
        dailypush_tip_2: 'Cada pedido incluye mastering, feedback profesional y soporte de envío a sellos.',
        dailypush_tip_3: 'Nuestro equipo trabaja con una amplia gama de géneros y estilos.',
        top100_tooltip_title: 'Para obtener los mejores resultados de nuestros servicios, asegúrate de que:',
        top100_tip_1: 'Tu track es una mezcla de alta calidad lista para mastering.',
        top100_tip_2: 'Proporcionas cualquier preferencia específica o tracks de referencia.',
        top100_tip_3: 'Tu información de contacto está actualizada.',
        top100_tip_4: 'Tienes los derechos de la track que envías.',
        top100_tip_5: 'El archivo de audio está en formato WAV o AIFF para mejores resultados de mastering.',
        top100_tip_6: 'Cualquier nota sobre tus sellos objetivo o sonido deseado está incluida.',
        top100_tip_7: 'Los pedidos realizados los fines de semana pueden tardar un poco más en procesarse.',
        top10_tooltip_title: 'Para nuestros servicios premium, asegúrate de que:',
        top10_tip_1: 'Tu track está completamente mezclada y lista para mastering.',
        top10_tip_2: 'Has incluido tracks de referencia si aplica.',
        top10_tip_3: 'Tu perfil de artista está completo con bio y foto.',
        top10_tip_4: 'Has especificado tus sellos o géneros objetivo.',
        top10_tip_footer_1: 'Si necesitas servicios adicionales, puedes explorar nuestro',
        top10_tip_footer_daily_push: 'paquete estándar',
        top10_tip_footer_2: 'diseñado para ofrecer a tu track mastering y feedback profesionales.',
        top10_tip_footer_3: 'Nuestro equipo te guiará durante todo el proceso, desde el mastering hasta el envío a sellos.',
        campaign_validate_genre: 'Por favor, confirma el género de tu track antes de realizar el pedido.',
        campaign_validate_artists: 'Por favor, ingresa al menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecciona una track antes de elegir un paquete.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paquete',
        campaign_summary_copies: 'servicios',
        how_badge: 'NUESTRO PROCESO',
        how_title: 'Cómo funciona <span class="text-gradient">AlphaStudios</span>',
        how_step1_title: 'Encuentra tu track',
        how_step1_desc: 'Busca tu track usando nuestra barra de búsqueda.',
        how_step1_detail: 'Selecciona la track en la que quieres que trabajemos.',
        how_step2_title: 'Elige tu paquete',
        how_step2_desc: 'Selecciona el paquete de servicios que se adapte a tus necesidades:',
        how_step2_li1: 'Mastering profesional',
        how_step2_li2: 'Feedback detallado',
        how_step2_li3: 'Soporte de envío a sellos',
        how_step2_li4: 'Todo en uno por solo $1',
        how_step2_detail: 'Nuestro paquete incluye mastering, feedback y soporte de envío a sellos.',
        how_step3_title: 'Procesamos tu pedido',
        how_step3_desc: 'Nuestro equipo comienza a trabajar en tu track.',
        how_step3_bullet1: 'AlphaStudios conecta tu música con ingenieros de mastering profesionales y expertos de la industria que proporcionan feedback detallado y recomendaciones de sellos.',
        how_step3_bullet2: 'Nuestro equipo procesa tu pedido y trabaja para entregar resultados de alta calidad.',
        how_step4_title: 'Recibe tus entregables',
        how_step4_desc: 'Una vez completado, recibes:',
        how_step4_li1: 'Tu track masterizada',
        how_step4_li2: 'Informe de feedback detallado',
        how_step4_li3: 'Recomendaciones de envío a sellos',
        how_step4_detail: 'Todos los entregables se envían por email en 24-48 horas.',
        how_step5_title: 'Soporte continuo',
        how_step5_desc: 'Estamos disponibles para preguntas de seguimiento y servicios adicionales.',
        why_badge: 'POR QUÉ ALPHASTUDIOS',
        why_title: 'Por qué elegir AlphaStudios para tu música',
        why_subtitle: 'Servicios profesionales de confianza',
        why_card1_title: 'Mastering de calidad',
        why_card1_text: 'Nuestros ingenieros de mastering entregan tracks listas para radio con precisión profesional y atención al detalle.',
        why_card2_title: 'Feedback profesional',
        why_card2_text: 'Recibe feedback detallado y accionable sobre tus tracks de profesionales experimentados de la industria que entienden lo que los sellos buscan.',
        why_card3_title: 'Soporte de envío a sellos',
        why_card3_text: 'Te ayudamos a identificar los sellos adecuados para tu música y te apoyamos en el proceso de envío para maximizar tus posibilidades de ser firmado.',
        faq_title: 'Preguntas frecuentes',
        faq0a_q: '¿Qué pasa después de hacer mi pedido?',
        faq0a_a: 'Una vez realizado tu pedido, recibirás inmediatamente un email de confirmación.<br>El proceso es rápido, sencillo y totalmente gestionado por nuestro equipo.<br><br><strong>Esto es lo que sucede después:</strong><br><br>1. <strong>Examen del track</strong> — Nuestro equipo revisa tu track y la prepara para el mastering.<br>2. <strong>Mastering</strong> — Nuestros ingenieros masteran tu track según estándares profesionales.<br>3. <strong>Informe de feedback</strong> — Preparamos un informe de feedback detallado sobre tu track.<br>4. <strong>Recomendaciones de sellos</strong> — Identificamos sellos adecuados y preparamos materiales de envío.<br>5. <strong>Entrega</strong> — Recibes todos los entregables por email en 24-48 horas.<br><br>Eso es todo. Relájate y deja que nuestro equipo se encargue del resto.',
        faq0b_q: '¿Cuál es la política de reembolso?',
        faq0b_a: 'Trabajamos duro para garantizar que cada pedido sea tratado con cuidado.<br><br>Si tu pedido no puede cumplirse o los entregables no pueden proporcionarse en el plazo anunciado, puedes solicitar:<br>• Un reembolso completo, o<br>• Un servicio de reemplazo<br><br>Contacta con nuestro equipo de soporte en cualquier momento si tienes preguntas o inquietudes.<br><br>Nuestro objetivo es siempre ofrecer un servicio transparente, fiable y profesional.',
        faq1_q: '¿Cuánto tiempo tarda?',
        faq1_a: 'La mayoría de los pedidos se entregan en 24-48 horas.',
        faq2_q: '¿Qué incluye el servicio?',
        faq2_a: 'Cada pedido incluye mastering profesional, feedback detallado y soporte de envío a sellos.',
        faq3_q: '¿Pueden los nuevos artistas usar el servicio?',
        faq3_a: 'Sí. Trabajamos con artistas de todos los niveles, desde principiantes hasta profesionales establecidos.',
        faq4_q: '¿Qué formatos de audio aceptan?',
        faq4_a: 'Aceptamos archivos WAV, AIFF y MP3 de alta calidad. Se recomienda WAV o AIFF para mejores resultados de mastering.',
        faq5_q: '¿Algún consejo / requisito?',
        cta_title: '¿Listo para llevar tu música al siguiente nivel?',
        cta_desc: 'Únete a cientos de artistas que usan AlphaStudios para servicios musicales profesionales.',
        cta_btn: 'EMPEZAR AHORA',
        footer_desc: 'Servicios musicales profesionales — Mastering + Feedback + Labels.',
        footer_nav: 'Navegación',
        footer_boost: 'Empezar',
        footer_how: 'Cómo funciona',
        footer_copy: '&copy; 2026 AlphaStudios. Todos los derechos reservados.',
        footer_terms: 'Términos de Uso',
    },
    de: {
        page_title: 'AlphaStudios - Professionelle Musikdienste',
        page_desc: 'Professionelle Mastering-, Feedback- und Label-Einreichungsdienste für DJs, Produzenten und Labels.',
        nav_how: 'WIE ES FUNKTIONIERT',
        nav_pricing: 'PREISE',
        nav_cta: 'JETZT STARTEN',
        hero_badge: 'Professionelle Musikdienste. Echte Ergebnisse.',
        hero_title: 'Professionelle Musikdienste für <span class="text-gradient">DJs</span>, <span class="text-gradient">Produzenten</span> und <span class="text-gradient">Labels.</span>',
        hero_subtitle: 'Mastering + Feedback + Labels für nur $1.',
        hero_cta_btn: 'JETZT STARTEN',
        feature_no_bots: 'Professionelles Mastering',
        feature_scheduling: 'Detaillierte Feedback-Berichte',
        feature_strategy: 'Label-Einreichungsunterstützung',
        feature_guarantee: 'Geld-zurück-Garantie',
        upload_badge: 'LADE DEINEN TRACK HOCH',
        upload_title: 'Lade deinen Track für <span class="text-green">Mastering</span> hoch',
        upload_desc: 'Ziehe deine Audiodatei hierher oder klicke zum Hochladen.',
        upload_tagline: 'Professionelle Qualität. Schnelle Lieferung. Erschwingliche Preise.',
        upload_drop_text: 'Ziehe deine Audiodatei hierher',
        upload_drop_hint: 'oder klicke zum Durchsuchen — WAV, AIFF, MP3, FLAC (max 100MB)',
        choose_validate_track: 'Bitte lade zuerst einen Track hoch, bevor du ein Paket wählst.',
        pricing_badge: 'PREISE',
        pricing_title: 'Wähle Dein <span class="text-green">Paket</span>',
        pricing_desc: 'Professionelle Musikdienste einschließlich Mastering, Feedback und Label-Einreichungsunterstützung — alles für nur $1.',
        choose_btn: 'Wählen',
        popular_badge: 'BELIEBT',
        change_track: 'Ändern',
        campaign_badge: 'AB IN DIE DETAILS',
        campaign_title: 'Bestellkonfiguration',
        campaign_desc: 'Konfiguriere deine Bestellung vor der Aufgabe.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Bestätige das erkannte Genre deines Tracks.',
        campaign_genre_hint_manual: 'Bitte gib dein Genre unten ein.',
        campaign_genre_input_placeholder: 'Genre eingeben (z.B. Afro House, Melodic Techno...)',
        campaign_confirm: 'Bestätigen',
        campaign_confirmed: 'Bestätigt',
        campaign_artists_label: 'Ähnliche Künstler',
        campaign_artists_hint: 'Gib 3 Künstler mit ähnlichem Stil wie dein Track ein — so können wir unser Feedback und unsere Label-Empfehlungen anpassen.',
        campaign_artists_placeholder: 'Beispiel: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Veröffentlichungsstatus',
        campaign_release_hint: 'Ist dein Track bereits veröffentlicht oder in Vorbestellung?',
        campaign_released: 'Bereits veröffentlicht',
        campaign_preorder: 'Vorbestellung',
        campaign_launch_btn: 'Bestellung aufgeben',
        payment_success: 'Zahlung bestätigt!',
        payment_success_sub: 'Ihre Bestellung wird bearbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.\nSie erhalten außerdem Ihre Lieferungen innerhalb von 24/48 Stunden.',
        payment_success_whatsapp_text: 'Wenn Sie über Ihren Track sprechen, eine Frage stellen oder einfach über Ihre Bestellung auf dem Laufenden bleiben möchten, zögern Sie nicht, uns zu kontaktieren.',
        payment_success_whatsapp_btn: 'Chatten Sie mit uns',
        campaign_tips_title: 'Tipps / Anforderungen',
        card_tooltip_title: 'Tipps & Anforderungen',
        campaign_tip_1: 'Für beste Ergebnisse reichen Sie hochwertige Audiodateien ein.',
        campaign_tip_2: 'Fügen Sie spezifische Anmerkungen oder Präferenzen für den Mastering-Ingenieur bei.',
        campaign_tip_5: 'Mastering: Wir empfehlen, ungemasterte Mixes einzureichen für die besten Ergebnisse.',
        campaign_tip_6: 'Feedback: Unser Team gibt detailliertes, umsetzbares Feedback zu Ihrem Track.',
        campaign_tip_7: 'Labels: Wir helfen bei der Identifizierung und Einreichung bei Labels, die zu Ihrem Stil passen.',
        campaign_tip_8: 'Lieferung: Die meisten Bestellungen werden innerhalb von 24-48 Stunden abgeschlossen.',
        dailypush_tip_1: 'Sie können jederzeit zusätzliche Bestellungen für weitere Tracks aufgeben.',
        dailypush_tip_2: 'Jede Bestellung beinhaltet Mastering, professionelles Feedback und Label-Einreichungsunterstützung.',
        dailypush_tip_3: 'Unser Team arbeitet mit einer breiten Palette von Genres und Stilen.',
        top100_tooltip_title: 'Um die besten Ergebnisse unserer Dienste zu erzielen, stellen Sie bitte sicher, dass:',
        top100_tip_1: 'Ihr Track ein hochwertiger Mix ist, der für das Mastering bereit ist.',
        top100_tip_2: 'Sie spezifische Präferenzen oder Referenztracks angeben.',
        top100_tip_3: 'Ihre Kontaktdaten aktuell sind.',
        top100_tip_4: 'Sie die Rechte an dem eingereichten Track besitzen.',
        top100_tip_5: 'Die Audiodatei im WAV- oder AIFF-Format vorliegt für beste Mastering-Ergebnisse.',
        top100_tip_6: 'Anmerkungen zu Ihren Ziel-Labels oder gewünschtem Sound enthalten sind.',
        top100_tip_7: 'Am Wochenende aufgegebene Bestellungen können etwas länger dauern.',
        top10_tooltip_title: 'Für unsere Premium-Dienste stellen Sie bitte sicher, dass:',
        top10_tip_1: 'Ihr Track vollständig gemischt und für das Mastering bereit ist.',
        top10_tip_2: 'Sie Referenztracks beigefügt haben, falls zutreffend.',
        top10_tip_3: 'Ihr Künstlerprofil mit Bio und Foto vollständig ist.',
        top10_tip_4: 'Sie Ihre Ziel-Labels oder Genres angegeben haben.',
        top10_tip_footer_1: 'Wenn Sie zusätzliche Dienste benötigen, können Sie unser',
        top10_tip_footer_daily_push: 'Standardpaket',
        top10_tip_footer_2: 'erkunden, das entwickelt wurde, um Ihrem Track professionelles Mastering und Feedback zu bieten.',
        top10_tip_footer_3: 'Unser Team begleitet Sie durch den gesamten Prozess, vom Mastering bis zur Label-Einreichung.',
        campaign_validate_genre: 'Bitte bestätige das Genre deines Tracks vor der Bestellung.',
        campaign_validate_artists: 'Bitte gib mindestens 1 ähnlichen Künstler ein.',
        choose_validate_track: 'Bitte wähle zuerst einen Track aus, bevor du ein Paket wählst.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paket',
        campaign_summary_copies: 'Dienste',
        how_badge: 'UNSER PROZESS',
        how_title: 'Wie AlphaStudios <span class="text-gradient">funktioniert</span>',
        how_step1_title: 'Finde deinen Track',
        how_step1_desc: 'Suche deinen Track über unsere Suchleiste.',
        how_step1_detail: 'Wähle den Track aus, an dem wir arbeiten sollen.',
        how_step2_title: 'Wähle dein Paket',
        how_step2_desc: 'Wähle das Servicepaket, das zu deinen Bedürfnissen passt:',
        how_step2_li1: 'Professionelles Mastering',
        how_step2_li2: 'Detailliertes Feedback',
        how_step2_li3: 'Label-Einreichungsunterstützung',
        how_step2_li4: 'Alles in einem für nur $1',
        how_step2_detail: 'Unser Paket beinhaltet Mastering, Feedback und Label-Einreichungsunterstützung.',
        how_step3_title: 'Wir bearbeiten deine Bestellung',
        how_step3_desc: 'Unser Team beginnt mit der Arbeit an deinem Track.',
        how_step3_bullet1: 'AlphaStudios verbindet deine Musik mit professionellen Mastering-Ingenieuren und Branchenexperten, die detailliertes Feedback und Label-Empfehlungen geben.',
        how_step3_bullet2: 'Unser Team bearbeitet deine Bestellung und arbeitet daran, hochwertige Ergebnisse zu liefern.',
        how_step4_title: 'Erhalte deine Lieferungen',
        how_step4_desc: 'Nach Abschluss erhältst du:',
        how_step4_li1: 'Deinen gemasterten Track',
        how_step4_li2: 'Detaillierten Feedback-Bericht',
        how_step4_li3: 'Label-Einreichungsempfehlungen',
        how_step4_detail: 'Alle Lieferungen werden per E-Mail innerhalb von 24-48 Stunden gesendet.',
        how_step5_title: 'Fortlaufender Support',
        how_step5_desc: 'Wir stehen für Folgefragen und zusätzliche Dienste zur Verfügung.',
        why_badge: 'WARUM ALPHASTUDIOS',
        why_title: 'Warum AlphaStudios für deine Musik wählen',
        why_subtitle: 'Professionelle Dienste, denen du vertrauen kannst',
        why_card1_title: 'Qualitäts-Mastering',
        why_card1_text: 'Unsere Mastering-Ingenieure liefern radiofertige Tracks mit professioneller Präzision und Liebe zum Detail.',
        why_card2_title: 'Professionelles Feedback',
        why_card2_text: 'Erhalte detailliertes, umsetzbares Feedback zu deinen Tracks von erfahrenen Branchenprofis, die verstehen, wonach Labels suchen.',
        why_card3_title: 'Label-Einreichungsunterstützung',
        why_card3_text: 'Wir helfen dir, die richtigen Labels für deine Musik zu finden und unterstützen dich beim Einreichungsprozess, um deine Chancen auf einen Vertrag zu maximieren.',
        faq_title: 'Häufig gestellte Fragen',
        faq0a_q: 'Was passiert nach meiner Bestellung?',
        faq0a_a: 'Sobald Ihre Bestellung aufgegeben wurde, erhalten Sie sofort eine Bestätigungs-E-Mail.<br>Der Prozess ist schnell, einfach und wird vollständig von unserem Team abgewickelt.<br><br><strong>Das passiert als Nächstes:</strong><br><br>1. <strong>Track-Überprüfung</strong> — Unser Team überprüft Ihren Track und bereitet ihn für das Mastering vor.<br>2. <strong>Mastering</strong> — Unsere Ingenieure mastern Ihren Track nach professionellen Standards.<br>3. <strong>Feedback-Bericht</strong> — Wir erstellen einen detaillierten Feedback-Bericht zu Ihrem Track.<br>4. <strong>Label-Empfehlungen</strong> — Wir identifizieren geeignete Labels und bereiten Einreichungsunterlagen vor.<br>5. <strong>Lieferung</strong> — Sie erhalten alle Lieferungen per E-Mail innerhalb von 24-48 Stunden.<br><br>Das war\'s. Lehnen Sie sich zurück und lassen Sie unser Team den Rest erledigen.',
        faq0b_q: 'Wie lautet die Rückerstattungsrichtlinie?',
        faq0b_a: 'Wir arbeiten hart daran, dass jede Bestellung sorgfältig bearbeitet wird.<br><br>Wenn Ihre Bestellung nicht erfüllt werden kann oder die Lieferungen nicht im angekündigten Zeitrahmen bereitgestellt werden können, können Sie Folgendes anfordern:<br>• Eine vollständige Rückerstattung, oder<br>• Einen Ersatzdienst<br><br>Kontaktieren Sie jederzeit unser Support-Team bei Fragen oder Bedenken.<br><br>Unser Ziel ist es immer, einen transparenten, zuverlässigen und professionellen Service zu bieten.',
        faq1_q: 'Wie lange dauert es?',
        faq1_a: 'Die meisten Bestellungen werden innerhalb von 24-48 Stunden geliefert.',
        faq2_q: 'Was ist im Service enthalten?',
        faq2_a: 'Jede Bestellung beinhaltet professionelles Mastering, detailliertes Feedback und Label-Einreichungsunterstützung.',
        faq3_q: 'Können neue Künstler den Service nutzen?',
        faq3_a: 'Ja. Wir arbeiten mit Künstlern aller Niveaus, von Anfängern bis zu etablierten Profis.',
        faq4_q: 'Welche Audioformate akzeptieren Sie?',
        faq4_a: 'Wir akzeptieren WAV-, AIFF- und hochwertige MP3-Dateien. WAV oder AIFF wird für beste Mastering-Ergebnisse empfohlen.',
        faq5_q: 'Tipps / Anforderungen?',
        cta_title: 'Bereit, deine Musik auf das nächste Level zu bringen?',
        cta_desc: 'Schließe dich Hunderten von Künstlern an, die AlphaStudios für professionelle Musikdienste nutzen.',
        cta_btn: 'JETZT STARTEN',
        footer_desc: 'Professionelle Musikdienste — Mastering + Feedback + Labels.',
        footer_nav: 'Navigation',
        footer_boost: 'Jetzt starten',
        footer_how: 'Wie es funktioniert',
        footer_copy: '&copy; 2026 AlphaStudios. Alle Rechte vorbehalten.',
        footer_terms: 'Nutzungsbedingungen',
    }
};

function detectLanguage() {
    const saved = localStorage.getItem('alphastudios_lang');
    if (saved && translations[saved]) return saved;
    return 'fr';
}

function applyTranslations(lang) {
    if (!lang) lang = detectLanguage();

    document.documentElement.lang = lang;
    const t = translations[lang] || translations.en;

    // data-i18n: textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // data-i18n-html: innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });

    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // data-i18n-content: meta tags
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
        const key = el.getAttribute('data-i18n-content');
        if (t[key]) el.setAttribute('content', t[key]);
    });

    if (t.page_title) document.title = t.page_title;

    // Update lang selector UI
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });
}

// Apply on load
applyTranslations();

// Language selector logic
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');

    // Toggle dropdown
    if (langBtn && langBtn.contains(e.target)) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        return;
    }

    // Select language
    const option = e.target.closest('.lang-option');
    if (option) {
        const lang = option.dataset.lang;
        localStorage.setItem('alphastudios_lang', lang);
        applyTranslations(lang);
        dropdown.classList.remove('open');
        return;
    }

    // Close dropdown on outside click
    if (dropdown) dropdown.classList.remove('open');
});

// ===== DOM Elements =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// ===== Artwork Generator =====
function generateTrackArtwork(size = 400) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Generate 3 random vibrant colors
    const hue1 = Math.random() * 360;
    const hue2 = (hue1 + 60 + Math.random() * 120) % 360;
    const hue3 = (hue2 + 60 + Math.random() * 120) % 360;
    const c1 = `hsl(${hue1}, 80%, 55%)`;
    const c2 = `hsl(${hue2}, 75%, 45%)`;
    const c3 = `hsl(${hue3}, 85%, 50%)`;

    // Base: diagonal gradient
    const grad1 = ctx.createLinearGradient(0, 0, size, size);
    grad1.addColorStop(0, c1);
    grad1.addColorStop(0.5, c2);
    grad1.addColorStop(1, c3);
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, size, size);

    // Layer: large radial glow (top-right)
    const grad2 = ctx.createRadialGradient(size * 0.75, size * 0.2, 0, size * 0.75, size * 0.2, size * 0.7);
    grad2.addColorStop(0, c1.replace('55%)', '65%)').replace('rgb', 'rgb') );
    grad2.addColorStop(0, `hsla(${hue1}, 80%, 65%, 0.6)`);
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, size, size);

    // Layer: second radial glow (bottom-left)
    const grad3 = ctx.createRadialGradient(size * 0.2, size * 0.8, 0, size * 0.2, size * 0.8, size * 0.65);
    grad3.addColorStop(0, `hsla(${hue3}, 85%, 60%, 0.5)`);
    grad3.addColorStop(1, 'transparent');
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, size, size);

    // Abstract geometric: flowing curves
    ctx.globalCompositeOperation = 'soft-light';
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yOff = size * (0.15 + i * 0.2) + (Math.random() - 0.5) * size * 0.1;
        ctx.moveTo(-10, yOff);
        const cp1x = size * 0.3 + Math.random() * size * 0.1;
        const cp1y = yOff - size * 0.15 + Math.random() * size * 0.3;
        const cp2x = size * 0.7 + Math.random() * size * 0.1;
        const cp2y = yOff + size * 0.15 - Math.random() * size * 0.3;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, size + 10, yOff + (Math.random() - 0.5) * size * 0.2);
        ctx.lineWidth = size * (0.03 + Math.random() * 0.04);
        ctx.strokeStyle = [c1, c2, c3][i % 3];
        ctx.stroke();
    }

    // Subtle grain overlay
    ctx.globalCompositeOperation = 'overlay';
    const grad4 = ctx.createLinearGradient(0, 0, 0, size);
    grad4.addColorStop(0, 'rgba(255,255,255,0.08)');
    grad4.addColorStop(0.5, 'transparent');
    grad4.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = grad4;
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'source-over';
    return canvas.toDataURL('image/jpeg', 0.85);
}

// ===== State =====
let selectedTrack = null;
let selectedPack = null;
let genreConfirmed = false;
let uploadedAudioFile = null;
let generatedArtworkDataUrl = null;
let audioContext = null;
let audioBuffer = null;
let audioElement = null;
let isPlaying = false;
let animFrameId = null;

// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== Artist Autocomplete Search =====
const artistInput = document.getElementById('similarArtists');
const artistResults = document.getElementById('artistSearchResults');
const artistTagsContainer = document.getElementById('artistTags');
let selectedArtists = [];
let artistSearchTimeout = null;

if (artistInput && artistResults) {
    artistInput.addEventListener('input', () => {
        clearTimeout(artistSearchTimeout);
        const query = artistInput.value.trim();
        if (query.length < 2) {
            artistResults.classList.remove('visible');
            return;
        }
        artistSearchTimeout = setTimeout(async () => {
            artistInput.classList.add('loading');
            try {
                let response;
                try {
                    response = await fetch(`${SEARCH_API_PROXY}?q=${encodeURIComponent(query)}&type=artist`);
                } catch (e) {
                    response = null;
                }
                if (!response || !response.ok) {
                    response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(query)}&type=artist`);
                }
                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                console.log('Artist search response:', data);
                renderArtistResults(data);
            } catch (err) {
                console.error('Artist search error:', err);
                artistResults.classList.remove('visible');
            } finally {
                artistInput.classList.remove('loading');
            }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.artist-search-wrapper')) {
            artistResults.classList.remove('visible');
        }
    });
}

function renderArtistResults(data) {
    const artists = data.results || data.artists || data || [];
    if (!artists.length) {
        artistResults.classList.remove('visible');
        return;
    }
    artistResults.innerHTML = artists.slice(0, 8).map(artist => {
        const name = artist.name || artist.title || artist;
        const img = artist.image || artist.image_url || artist.artwork || artist.thumb || '';
        const id = artist.id || name;
        const safeImg = typeof img === 'string' ? img.replace(/"/g, '&quot;') : '';
        return `<div class="artist-result-item" data-name="${typeof name === 'string' ? name.replace(/"/g, '&quot;') : name}" data-id="${id}" data-img="${safeImg}">
            ${img
                ? `<img src="${safeImg}" alt="" onerror="this.outerHTML='<div class=\\'artist-avatar-placeholder\\'><svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'/><circle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'/></svg></div>'">`
                : `<div class="artist-avatar-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`
            }
            <span>${typeof name === 'string' ? name : name}</span>
        </div>`;
    }).join('');
    artistResults.classList.add('visible');

    artistResults.querySelectorAll('.artist-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            const img = item.dataset.img || '';
            if (!selectedArtists.find(a => a.name === name)) {
                selectedArtists.push({ name, img });
                renderArtistTags();
            }
            artistInput.value = '';
            artistResults.classList.remove('visible');
        });
    });
}

function renderArtistTags() {
    artistTagsContainer.innerHTML = selectedArtists.map((artist, i) => {
        const name = typeof artist === 'string' ? artist : artist.name;
        const img = typeof artist === 'string' ? '' : (artist.img || '');
        return `<span class="artist-tag">
            ${img
                ? `<img src="${img}" alt="" class="artist-tag-img" onerror="this.remove()">`
                : `<span class="artist-tag-avatar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>`
            }
            ${name}
            <button class="artist-tag-remove" data-index="${i}" type="button">&times;</button>
        </span>`;
    }).join('');

    artistTagsContainer.querySelectorAll('.artist-tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedArtists.splice(parseInt(btn.dataset.index), 1);
            renderArtistTags();
        });
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
    }
});

// ===== Audio Upload & Waveform =====
const uploadDropzone = document.getElementById('uploadDropzone');
const audioFileInput = document.getElementById('audioFileInput');
const trackPreview = document.getElementById('trackPreview');
const waveformCanvas = document.getElementById('waveformCanvas');
const waveformPlayBtn = document.getElementById('waveformPlayBtn');
const waveformProgress = document.getElementById('waveformProgress');
const waveformTimeEl = document.getElementById('waveformTime');
const waveformDurationEl = document.getElementById('waveformDuration');
const trackRemoveBtn = document.getElementById('trackRemoveBtn');
const waveformWrap = document.querySelector('.waveform-wrap');

// Dropzone click
if (uploadDropzone) {
    uploadDropzone.addEventListener('click', () => audioFileInput.click());
    uploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadDropzone.classList.add('drag-over');
    });
    uploadDropzone.addEventListener('dragleave', () => {
        uploadDropzone.classList.remove('drag-over');
    });
    uploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) handleAudioUpload(file);
    });
}

if (audioFileInput) {
    audioFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleAudioUpload(file);
    });
}

// Remove track
if (trackRemoveBtn) {
    trackRemoveBtn.addEventListener('click', () => {
        removeUploadedTrack();
    });
}

function removeUploadedTrack() {
    if (audioElement) { audioElement.pause(); audioElement = null; }
    if (animFrameId) cancelAnimationFrame(animFrameId);
    isPlaying = false;
    uploadedAudioFile = null;
    audioBuffer = null;
    selectedTrack = null;
    selectedPack = null;
    generatedArtworkDataUrl = null;

    // Reset artwork to placeholder
    const artworkEl = document.getElementById('trackPreviewArtwork');
    if (artworkEl) {
        artworkEl.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
    }

    if (trackPreview) trackPreview.style.display = 'none';
    if (uploadDropzone) uploadDropzone.style.display = '';
    if (audioFileInput) audioFileInput.value = '';

    // Reset analysis tags
    const analysisTags = document.getElementById('trackAnalysisTags');
    if (analysisTags) { analysisTags.style.display = 'none'; analysisTags.innerHTML = ''; }

    // Reset play button
    if (waveformPlayBtn) waveformPlayBtn.classList.remove('playing');
    if (waveformProgress) waveformProgress.style.width = '0%';
    if (waveformTimeEl) waveformTimeEl.textContent = '0:00';

    // Hide inline campaign form & pricing card
    const inlineForm = document.getElementById('inlineCampaignForm');
    if (inlineForm) inlineForm.style.display = 'none';
    const inlinePricing = document.getElementById('inlinePricingCard');
    if (inlinePricing) inlinePricing.style.display = 'none';
    const banner = document.getElementById('selectedTrackBanner');
    if (banner) banner.remove();
}

function showUploadCountdown() {
    const dropzone = document.getElementById('uploadDropzone');
    if (!dropzone) return { cancel: () => {} };

    const originalContent = dropzone.innerHTML;

    // Build number spans (10 → 0) and message spans — all CSS animated, ZERO JS
    const nums = [];
    for (let i = 10; i >= 0; i--) nums.push(`<span class="cd-n" style="animation-delay:${(10 - i)}s">${i}</span>`);

    const msgs = [
        { t: 'Uploading your track...', d: 0 },
        { t: 'Reading audio data...', d: 2 },
        { t: 'Analyzing frequencies...', d: 4 },
        { t: 'Detecting BPM & key...', d: 6 },
        { t: 'Measuring loudness...', d: 8 },
        { t: 'Almost there! We are as excited as you are!', d: 10 },
    ];
    const msgSpans = msgs.map(m => `<span class="cd-m" style="animation-delay:${m.d}s">${m.t}</span>`);

    dropzone.innerHTML = `
        <div class="cd-wrap">
            <div class="cd-ring-wrap">
                <div class="cd-ring-bg"></div>
                <div class="cd-ring-fill"></div>
                <img class="cd-icon" src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773648385/Black_and_Red_Modern_Initials_A_E-Sport_Gaming_Pictorial_Mark_Logo_hx5o3z.png" alt="" width="32" height="32">
            </div>
            <div class="cd-nums">${nums.join('')}</div>
            <div class="cd-msgs">${msgSpans.join('')}</div>
            <div class="cd-dots"><span></span><span></span><span></span></div>
        </div>
    `;

    // Inject styles once — 100% CSS, zero JS animation code
    if (!document.getElementById('cd-styles')) {
        const s = document.createElement('style');
        s.id = 'cd-styles';
        s.textContent = `
            @property --cd-progress{syntax:"<percentage>";inherits:false;initial-value:0%}
            .cd-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:24px 0;animation:cd-in .35s ease}
            .cd-ring-wrap{position:relative;width:80px;height:80px}
            .cd-ring-bg{position:absolute;inset:0;border-radius:50%;border:3px solid rgba(128,128,128,0.15)}
            .cd-ring-fill{position:absolute;inset:0;border-radius:50%;--cd-progress:0%;background:conic-gradient(var(--green-primary,#00a854) var(--cd-progress),transparent var(--cd-progress));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3.5px),#000 calc(100% - 3.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 3.5px),#000 calc(100% - 3.5px));animation:cd-ring-anim 10s linear forwards}
            .cd-icon{position:absolute;top:50%;left:50%;width:32px;height:32px;border-radius:50%;object-fit:cover;transform:translate(-50%,-50%);animation:cd-spin 3s linear infinite}

            .cd-nums{position:relative;height:1.8rem;width:3rem;text-align:center}
            .cd-n{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:var(--green-primary,#00a854);font-variant-numeric:tabular-nums;opacity:0;animation:cd-show 1s steps(1) forwards}
            .cd-n:first-child{opacity:1}

            .cd-msgs{position:relative;height:1.2em;min-width:200px;text-align:center}
            .cd-m{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:500;color:var(--text-secondary,#888);letter-spacing:.3px;opacity:0;animation:cd-show 2s steps(1) forwards}
            .cd-m:first-child{opacity:1}
            .cd-m:last-child{animation:cd-show-last 2s steps(1) forwards}

            .cd-dots{display:flex;gap:5px}
            .cd-dots span{width:6px;height:6px;border-radius:50%;background:var(--green-primary,#00a854);opacity:.25;animation:cd-bounce 1.4s ease-in-out infinite}
            .cd-dots span:nth-child(2){animation-delay:.2s}
            .cd-dots span:nth-child(3){animation-delay:.4s}

            @keyframes cd-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
            @keyframes cd-spin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
            @keyframes cd-bounce{0%,80%,100%{opacity:.25;transform:scale(1)}40%{opacity:1;transform:scale(1.3)}}
            @keyframes cd-ring-anim{0%{--cd-progress:0%}100%{--cd-progress:100%}}
            @keyframes cd-show{0%{opacity:0}0.1%{opacity:1}99.9%{opacity:1}100%{opacity:0}}
            @keyframes cd-show-last{0%{opacity:0}0.1%{opacity:1}100%{opacity:1}}
        `;
        document.head.appendChild(s);
    }

    const cancel = () => {
        dropzone.innerHTML = originalContent;
    };

    return { cancel };
}

async function handleAudioUpload(file) {
    // Validate file
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        showToast('File too large. Maximum size is 100MB.');
        return;
    }

    uploadedAudioFile = file;

    const trackTitle = file.name.replace(/\.[^/.]+$/, '');

    // Start countdown IMMEDIATELY — all CSS animations, never freezes
    const countdown = showUploadCountdown();

    try {
        generatedArtworkDataUrl = generateTrackArtwork(400);

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Start upload + decode in PARALLEL
        // Countdown is pure CSS animation — won't freeze even if decode blocks main thread
        const uploadPromise = uploadTrackFiles(file, generatedArtworkDataUrl).then(urls => {
            if (urls.audioUrl) {
                window._preUploadedAudioUrl = urls.audioUrl;
                console.log('[AlphaStudios] Audio ready:', urls.audioUrl);
            }
            if (urls.artworkUrl) {
                window._preUploadedArtworkUrl = urls.artworkUrl;
                console.log('[AlphaStudios] Artwork ready:', urls.artworkUrl);
            }
            return urls;
        });

        const decodePromise = file.arrayBuffer().then(ab => audioContext.decodeAudioData(ab));

        // Wait for BOTH — waveform ready when we show the preview
        const [urls, decodedBuffer] = await Promise.all([uploadPromise, decodePromise]);
        audioBuffer = decodedBuffer;

        // Everything ready — cancel countdown, show preview with waveform
        countdown.cancel();

        const metadata = extractMetadata(file, decodedBuffer);

        selectedTrack = {
            title: trackTitle,
            artist: '',
            artwork: generatedArtworkDataUrl,
            id: urls.audioUrl || '',
            genre: '',
            file: file,
            metadata: metadata
        };
        if (urls.artworkUrl) selectedTrack.artwork = urls.artworkUrl;

        // Show track preview
        if (uploadDropzone) uploadDropzone.style.display = 'none';
        if (trackPreview) trackPreview.style.display = '';

        const titleEl = document.getElementById('trackPreviewTitle');
        if (titleEl) titleEl.textContent = trackTitle;

        const artworkEl = document.getElementById('trackPreviewArtwork');
        if (artworkEl && generatedArtworkDataUrl) {
            artworkEl.innerHTML = `<img src="${generatedArtworkDataUrl}" alt="Track artwork">`;
        }

        renderMetaTags(metadata);

        if (waveformDurationEl) {
            waveformDurationEl.textContent = formatTime(decodedBuffer.duration);
        }

        // Draw waveform
        drawWaveform(decodedBuffer);

        // Create audio element for playback
        audioElement = new Audio();
        audioElement.src = URL.createObjectURL(file);

        // Show inline campaign form
        selectedPack = 'mastering';
        const inlineForm = document.getElementById('inlineCampaignForm');
        if (inlineForm) inlineForm.style.display = '';

        // Scroll to the track preview
        setTimeout(() => {
            const preview = document.getElementById('trackPreview');
            if (preview) preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);

        // Analyze with Essentia (non-blocking)
        analyzeWithEssentia(decodedBuffer);

    } catch (err) {
        countdown.cancel();
        console.error('Audio upload error:', err);
        showToast('Could not process this audio file. Please try a different format.');
    }
}

function extractMetadata(file, buffer) {
    const duration = buffer.duration;
    const sampleRate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;
    const fileSize = file.size;
    const fileName = file.name;
    const ext = fileName.split('.').pop().toUpperCase();

    // Detect format from extension
    const formatMap = { 'MP3': 'Mp3', 'WAV': 'Wav', 'AIFF': 'Aiff', 'AIF': 'Aiff', 'FLAC': 'Flac', 'OGG': 'Ogg', 'M4A': 'M4a' };
    const format = formatMap[ext] || ext;

    // Calculate bitrate approximation
    const bitrate = Math.round((fileSize * 8) / duration / 1000);

    return {
        duration: duration,
        durationFormatted: formatTime(duration),
        fileSize: fileSize,
        fileSizeFormatted: formatFileSize(fileSize),
        format: format,
        sampleRate: sampleRate,
        channels: channels,
        bitrate: bitrate,
        fileName: fileName
    };
}

function renderMetaTags(metadata) {
    const container = document.getElementById('trackMetaTags');
    if (!container) return;

    const tags = [];
    tags.push(`<span class="meta-tag">${metadata.durationFormatted}</span>`);
    tags.push(`<span class="meta-tag">${metadata.format}</span>`);

    container.innerHTML = tags.join('');
}

function drawWaveform(buffer) {
    const canvas = waveformCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 80 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '80px';
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = 80;
    const channelData = buffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const halfHeight = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw bars
    const barWidth = 2;
    const barGap = 1;
    const totalBarWidth = barWidth + barGap;
    const numBars = Math.floor(width / totalBarWidth);
    const samplesPerBar = Math.floor(channelData.length / numBars);

    for (let i = 0; i < numBars; i++) {
        let sum = 0;
        const start = i * samplesPerBar;
        for (let j = start; j < start + samplesPerBar && j < channelData.length; j++) {
            sum += Math.abs(channelData[j]);
        }
        const avg = sum / samplesPerBar;
        const barHeight = Math.max(2, avg * halfHeight * 1.8);

        const x = i * totalBarWidth;
        ctx.fillStyle = 'rgba(26, 26, 46, 0.25)';
        ctx.fillRect(x, halfHeight - barHeight, barWidth, barHeight * 2);
    }
}

// Playback controls
if (waveformPlayBtn) {
    waveformPlayBtn.addEventListener('click', () => {
        if (!audioElement) return;
        if (isPlaying) {
            audioElement.pause();
            isPlaying = false;
            waveformPlayBtn.classList.remove('playing');
            cancelAnimationFrame(animFrameId);
        } else {
            audioElement.play();
            isPlaying = true;
            waveformPlayBtn.classList.add('playing');
            updatePlaybackProgress();
        }
    });
}

function updatePlaybackProgress() {
    if (!audioElement || !isPlaying) return;
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    if (waveformProgress) waveformProgress.style.width = progress + '%';
    if (waveformTimeEl) waveformTimeEl.textContent = formatTime(audioElement.currentTime);

    if (audioElement.ended) {
        isPlaying = false;
        waveformPlayBtn.classList.remove('playing');
        if (waveformProgress) waveformProgress.style.width = '0%';
        if (waveformTimeEl) waveformTimeEl.textContent = '0:00';
        return;
    }
    animFrameId = requestAnimationFrame(updatePlaybackProgress);
}

// Click on waveform to seek
if (waveformWrap) {
    waveformWrap.addEventListener('click', (e) => {
        if (!audioElement || !audioElement.duration) return;
        const rect = waveformWrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const ratio = x / rect.width;
        audioElement.currentTime = ratio * audioElement.duration;
        if (waveformProgress) waveformProgress.style.width = (ratio * 100) + '%';
        if (waveformTimeEl) waveformTimeEl.textContent = formatTime(audioElement.currentTime);
    });
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ===== Essentia Audio Analysis (runs in browser via WebAssembly) =====
let essentiaInstance = null;
let essentiaReady = false;

// Initialize Essentia WASM
if (typeof EssentiaWASM !== 'undefined') {
    EssentiaWASM().then(function(wasmModule) {
        essentiaInstance = new Essentia(wasmModule);
        essentiaReady = true;
        console.log('[Essentia] Ready — version:', essentiaInstance.version);
    }).catch(function(err) {
        console.error('[Essentia] Failed to initialize:', err);
    });
}

async function analyzeWithEssentia(buffer) {
    const analysisTags = document.getElementById('trackAnalysisTags');
    const metaTagsContainer = document.getElementById('trackMetaTags');
    if (analysisTags) {
        analysisTags.style.display = 'none';
    }
    // Show analyzing spinner in meta tags line
    if (metaTagsContainer) {
        metaTagsContainer.innerHTML += '<span class="meta-tag meta-tag-accent" id="analyzingSpinner"><span class="cyanite-spinner"></span> Analyzing...</span>';
    }

    try {
        // Wait for Essentia to be ready (max 5s)
        let waited = 0;
        while (!essentiaReady && waited < 5000) {
            await new Promise(r => setTimeout(r, 100));
            waited += 100;
        }
        if (!essentiaReady || !essentiaInstance) {
            throw new Error('Essentia not available');
        }

        // Convert AudioBuffer to mono Float32Array
        let monoData;
        if (buffer.numberOfChannels === 1) {
            monoData = buffer.getChannelData(0);
        } else {
            // Manual downmix: average all channels
            const len = buffer.length;
            monoData = new Float32Array(len);
            const ch0 = buffer.getChannelData(0);
            const ch1 = buffer.getChannelData(1);
            for (let i = 0; i < len; i++) {
                monoData[i] = (ch0[i] + ch1[i]) / 2;
            }
        }
        const audioVector = essentiaInstance.arrayToVector(monoData);

        console.log('[Essentia] Analyzing', monoData.length, 'samples at', buffer.sampleRate, 'Hz');

        const results = {};

        // BPM (RhythmExtractor2013 is more accurate than PercivalBpmEstimator)
        try {
            const rhythmResult = essentiaInstance.RhythmExtractor2013(audioVector);
            results.bpm = rhythmResult.bpm;
            results.confidence = rhythmResult.confidence;
            console.log('[Essentia] BPM:', results.bpm, 'confidence:', results.confidence);
        } catch (e) {
            console.warn('[Essentia] RhythmExtractor2013 failed, trying PercivalBpmEstimator:', e.message);
            try {
                const bpmResult = essentiaInstance.PercivalBpmEstimator(audioVector);
                results.bpm = bpmResult.bpm;
                console.log('[Essentia] BPM (Percival fallback):', results.bpm);
            } catch (e2) { console.warn('[Essentia] BPM extraction failed:', e2.message); }
        }

        // Key + Scale
        try {
            const keyResult = essentiaInstance.KeyExtractor(audioVector);
            results.key = keyResult.key;
            results.scale = keyResult.scale;
            results.keyStrength = keyResult.strength;
            console.log('[Essentia] Key:', results.key, results.scale);
        } catch (e) { console.warn('[Essentia] Key extraction failed:', e.message); }

        // Energy
        try {
            const energyResult = essentiaInstance.Energy(audioVector);
            results.energy = energyResult.energy;
            console.log('[Essentia] Energy:', results.energy);
        } catch (e) { console.warn('[Essentia] Energy extraction failed:', e.message); }

        // Dynamic Complexity + Loudness
        try {
            const dynResult = essentiaInstance.DynamicComplexity(audioVector);
            results.dynamicComplexity = dynResult.dynamicComplexity;
            results.loudness = dynResult.loudness;
            console.log('[Essentia] Dynamic complexity:', results.dynamicComplexity, 'Loudness:', results.loudness);
        } catch (e) { console.warn('[Essentia] DynamicComplexity failed:', e.message); }

        // Free the vector
        audioVector.delete();

        renderAnalysisTags(results);

    } catch (err) {
        console.error('[Essentia] Error:', err);
        // Remove analyzing spinner
        const spinner = document.getElementById('analyzingSpinner');
        if (spinner) spinner.remove();
    }
}

function renderAnalysisTags(data) {
    const metaContainer = document.getElementById('trackMetaTags');
    const analysisContainer = document.getElementById('trackAnalysisTags');

    // Remove analyzing spinner
    const spinner = document.getElementById('analyzingSpinner');
    if (spinner) spinner.remove();

    const tags = [];

    if (data.bpm && data.bpm > 0) {
        tags.push(`<span class="meta-tag meta-tag-accent">${Math.round(data.bpm) + 10} BPM</span>`);
    }
    if (data.key) {
        const keyLabel = data.scale ? `${data.key} ${data.scale}` : data.key;
        tags.push(`<span class="meta-tag meta-tag-accent">${escapeHtml(keyLabel)}</span>`);
    }
    if (data.energy != null) {
        const energyNorm = Math.sqrt(data.energy);
        const level = energyNorm > 0.15 ? 'high' : energyNorm > 0.05 ? 'medium' : 'low';
        const bars = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
        let barsHtml = '';
        for (let i = 0; i < 3; i++) {
            barsHtml += `<span class="meta-tag-energy-bar ${i < bars ? 'active' : ''}${bars === 3 ? ' high' : ''}"></span>`;
        }
        tags.push(`<span class="meta-tag"><span class="meta-tag-energy">${barsHtml}</span> Energy</span>`);
    }
    if (data.loudness != null) {
        tags.push(`<span class="meta-tag">${data.loudness.toFixed(1)} dB loudness</span>`);
    }

    // Append analysis tags to meta tags line (same row above track)
    if (metaContainer) {
        metaContainer.innerHTML += tags.join('');
    }
    // Hide separate analysis container
    if (analysisContainer) {
        analysisContainer.style.display = 'none';
    }
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .product-card, .section-header, .search-box, .upload-box, .cta-box, .faq-item, .why-choose-card, .campaign-setup-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Step Timeline Scroll Highlight =====
const stepCards = document.querySelectorAll('.step-card-v2');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('step-active');
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
});

stepCards.forEach(card => {
    stepObserver.observe(card);
});

// ===== (Search removed — replaced by upload) =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function changeTrack() {
    removeUploadedTrack();
    // Scroll back to upload
    const searchSection = document.getElementById('search');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Package Selection =====
// Inline pricing "Start Free Trial" button — redirect to Stripe checkout with trial
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('#inlinePricingBtn');
    if (!btn) return;
    e.preventDefault();

    const user = typeof BeatpushAuth !== 'undefined' ? BeatpushAuth.getUser() : null;

    // Require login first
    if (typeof requireAuth === 'function' && !requireAuth('payment')) return;

    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.textContent = 'Redirecting...';

    try {
        const checkoutRes = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user?.id || '', user_email: user?.email || '' }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
            window.location.href = checkoutData.url;
        } else {
            showToast('Failed to start subscription. Please try again.');
            btn.disabled = false;
            btn.style.opacity = '';
            btn.textContent = 'Start Free Trial';
        }
    } catch (err) {
        console.error('[AlphaStudios] Checkout error:', err);
        showToast('Failed to start subscription. Please try again.');
        btn.disabled = false;
        btn.style.opacity = '';
        btn.textContent = 'Start Free Trial';
    }
});

// Genre dropdown selector
const GENRE_LIST = [
    '140 / Deep Dubstep / Grime', 'Afro House', 'Amapiano', 'Ambient / Experimental',
    'Bass / Club', 'Bass House', 'Brazilian Funk', 'Breaks / Breakbeat / UK Bass',
    'Dance / Pop', 'Deep House', 'DJ Tools / Acapellas', 'Downtempo',
    'Drum & Bass', 'Dubstep', 'Electro (Classic / Detroit / Modern)', 'Electronica',
    'Funky House', 'Hard Dance / Hardcore / Neo Rave', 'Hard Techno', 'House',
    'Indie Dance', 'Jackin House', 'Mainstage', 'Melodic House & Techno',
    'Minimal / Deep Tech', 'Nu Disco / Disco', 'Organic House', 'Progressive House',
    'Psy-Trance', 'Tech House', 'Techno (Peak Time / Driving)',
    'Techno (Raw / Deep / Hypnotic)', 'Trance (Main Floor)',
    'Trance (Raw / Deep / Hypnotic)', 'Trap / Future Bass', 'UK Garage / Bassline'
];
let selectedGenres = [];

function renderGenreSelection() {
    const tagsContainer = document.getElementById('genreSelectedTags');
    const trigger = document.getElementById('genreDropdownTrigger');
    const placeholder = document.getElementById('genreDropdownPlaceholder');
    if (!tagsContainer) return;

    tagsContainer.innerHTML = selectedGenres.map(g =>
        `<span class="genre-selected-tag">${g}<button class="genre-remove" data-genre="${g}">&times;</button></span>`
    ).join('');

    // Update placeholder and trigger state
    if (placeholder) {
        placeholder.textContent = selectedGenres.length >= 1 ? '' : 'Select your genre';
    }
    if (trigger) {
        trigger.style.display = selectedGenres.length >= 1 ? 'none' : '';
    }

    // Auto-confirm when at least 1 genre is selected
    genreConfirmed = selectedGenres.length > 0;

    // Update price for Top 100 if applicable
    if (selectedPack === 'promo-430' && selectedGenres.length > 0) {
        const genrePrice = getTop100Price(selectedGenres[0]);
        const priceSummary = document.getElementById('campaignPriceSummary');
        if (priceSummary && genrePrice) {
            const lang = detectLanguage();
            const t = translations[lang] || translations.en;
            const priceLabel = t.campaign_total || 'Total';
            priceSummary.textContent = `${priceLabel}: $${genrePrice.toLocaleString('en-US')}`;
        }
    }
}

function renderGenreDropdownList(filter = '') {
    const list = document.getElementById('genreDropdownList');
    if (!list) return;
    const q = filter.toLowerCase();
    list.innerHTML = GENRE_LIST
        .filter(g => !q || g.toLowerCase().includes(q))
        .map(g => `<div class="genre-dropdown-item${selectedGenres.includes(g) ? ' selected' : ''}" data-genre="${g}">${g}</div>`)
        .join('');
}

// Toggle dropdown
document.getElementById('genreDropdownTrigger')?.addEventListener('click', function() {
    if (selectedGenres.length >= 1) return;
    const dropdown = document.getElementById('genreDropdown');
    const isOpen = dropdown.style.display !== 'none';
    dropdown.style.display = isOpen ? 'none' : '';
    if (!isOpen) {
        const searchInput = document.getElementById('genreSearchInput');
        searchInput.value = '';
        renderGenreDropdownList();
        searchInput.focus();
    }
});

// Search filter
document.getElementById('genreSearchInput')?.addEventListener('input', function() {
    renderGenreDropdownList(this.value);
});

// Select genre from dropdown
document.getElementById('genreDropdownList')?.addEventListener('click', function(e) {
    const item = e.target.closest('.genre-dropdown-item');
    if (!item) return;
    const genre = item.dataset.genre;
    if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(g => g !== genre);
    } else if (selectedGenres.length < 1) {
        selectedGenres.push(genre);
    }
    renderGenreSelection();
    renderGenreDropdownList(document.getElementById('genreSearchInput')?.value || '');
    // Close dropdown if 2 selected
    if (selectedGenres.length >= 1) {
        document.getElementById('genreDropdown').style.display = 'none';
    }
});

// Remove genre tag
document.getElementById('genreSelectedTags')?.addEventListener('click', function(e) {
    const btn = e.target.closest('.genre-remove');
    if (!btn) return;
    selectedGenres = selectedGenres.filter(g => g !== btn.dataset.genre);
    renderGenreSelection();
});

// Close dropdown on outside click
document.addEventListener('click', function(e) {
    const wrapper = document.getElementById('genreSelectWrapper');
    const dropdown = document.getElementById('genreDropdown');
    if (wrapper && dropdown && !wrapper.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Tips toggle
const tipsToggleEl = document.getElementById('tipsToggle');
if (tipsToggleEl) {
    tipsToggleEl.addEventListener('click', function() {
        this.closest('.campaign-tips').classList.toggle('open');
    });
}

// Upload audio + artwork to Supabase Storage, returns URLs
async function uploadTrackFiles(audioFile, artworkDataUrl) {
    let audioUrl = '';
    let artworkUrl = '';

    if (audioFile) {
        try {
            const signRes = await fetch('/api/upload-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: audioFile.name }),
            });
            const signData = await signRes.json();
            if (signRes.ok && signData.uploadUrl) {
                const uploadRes = await fetch(signData.uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': audioFile.type || 'audio/wav' },
                    body: audioFile,
                });
                if (uploadRes.ok) {
                    audioUrl = signData.publicUrl;
                    console.log('[AlphaStudios] Audio uploaded:', audioUrl);
                } else {
                    console.error('[AlphaStudios] Audio upload failed:', uploadRes.status);
                }
            }
        } catch (e) {
            console.error('[AlphaStudios] Audio upload error:', e);
        }
    }

    if (artworkDataUrl) {
        try {
            const signRes = await fetch('/api/upload-audio?type=artwork', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: `artwork_${Date.now()}.jpg` }),
            });
            const signData = await signRes.json();
            if (signRes.ok && signData.uploadUrl) {
                const artBlob = await (await fetch(artworkDataUrl)).blob();
                const upRes = await fetch(signData.uploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'image/jpeg' },
                    body: artBlob,
                });
                if (upRes.ok) {
                    artworkUrl = signData.publicUrl;
                    console.log('[AlphaStudios] Artwork uploaded:', artworkUrl);
                }
            }
        } catch (e) {
            console.error('[AlphaStudios] Artwork upload error:', e);
        }
    }

    return { audioUrl, artworkUrl };
}

// Make it available globally for dashboard post-checkout
window.uploadTrackFiles = uploadTrackFiles;

// Launch campaign button
document.getElementById('launchCampaignBtn').addEventListener('click', async function() {
    // Helper to update launch button state
    const launchBtn = document.getElementById('launchCampaignBtn');
    const originalBtnText = launchBtn ? launchBtn.textContent : '';
    function setBtnLoading(text) {
        if (launchBtn) { launchBtn.disabled = true; launchBtn.style.opacity = '0.7'; launchBtn.textContent = text; }
    }
    function resetBtn() {
        if (launchBtn) { launchBtn.disabled = false; launchBtn.style.opacity = ''; launchBtn.textContent = originalBtnText; }
    }

    // Require login before any payment action
    if (typeof requireAuth === 'function' && !requireAuth('payment')) return;

    const lang = detectLanguage();
    const t = translations[lang] || translations.en;

    // Pack is always 'mastering' (auto-selected)
    if (!selectedPack) selectedPack = 'mastering';

    // Validate genre selected
    if (!selectedGenres.length) {
        showToast(t.campaign_validate_genre || 'Please select at least one genre for your track.');
        highlightField(document.getElementById('genreDropdownTrigger'));
        return;
    }

    // Validate at least 1 similar artist
    const artistsField = document.getElementById('similarArtists');
    if (!selectedArtists.length) {
        showToast(t.campaign_validate_artists || 'Please enter at least 1 similar artist.');
        highlightField(artistsField);
        return;
    }

    const packToSend = selectedPack || 'mastering';

    const track = selectedTrack || {};
    const genre = selectedGenres.join(', ') || track.genre || '';
    const artists = selectedArtists.map(a => a.name).join(', ');
    const releaseStatus = document.querySelector('input[name="releaseStatus"]:checked')?.value || '';

    // Use URLs from countdown upload (already in selectedTrack.id and selectedTrack.artwork)
    const campaignData = {
        pack: packToSend,
        track_title: track.title || '',
        track_artist: track.artist || '',
        track_artwork: window._preUploadedArtworkUrl || track.artwork || '',
        track_url: window._preUploadedAudioUrl || track.id || '',
        genre: genre,
        similar_artists: selectedArtists.map(a => ({ name: a.name, img: a.img || '' })),
        release_status: releaseStatus,
    };

    setBtnLoading('Processing...');

    // Check subscription status
    const user = typeof BeatpushAuth !== 'undefined' ? BeatpushAuth.getUser() : null;
    let profile = null;
    if (user) {
        try { profile = await BeatpushAuth.getProfile(); } catch (e) {}
    }

    const subStatus = profile?.subscription_status;
    const hasSubscription = subStatus === 'active' || subStatus === 'trialing';

    if (hasSubscription) {
        // User is subscribed — check track limit
        const tracksUsed = profile.tracks_used_this_month || 0;
        const tracksLimit = subStatus === 'trialing' ? 1 : 5;

        // Trial user at limit → redirect to paid checkout (no trial)
        if (subStatus === 'trialing' && tracksUsed >= tracksLimit) {
            localStorage.setItem('alphastudios_pending_campaign', JSON.stringify(campaignData));
            setBtnLoading('Redirecting...');
            try {
                const checkoutRes = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id, user_email: user.email, skip_trial: true }),
                });
                const checkoutData = await checkoutRes.json();
                if (checkoutData.url) {
                    window.location.href = checkoutData.url;
                } else {
                    showToast('Failed to start subscription. Please try again.');
                    resetBtn();
                }
            } catch (err) {
                console.error('[AlphaStudios] Checkout error:', err);
                showToast('Failed to start subscription. Please try again.');
                resetBtn();
            }
            return;
        }

        // Active (paying) user at limit → block
        if (subStatus === 'active' && tracksUsed >= tracksLimit) {
            showToast(`You've reached your limit of ${tracksLimit} tracks this month.`);
            resetBtn();
            return;
        }

        // User has capacity — save order directly and redirect to dashboard
        try {
            setBtnLoading('Submitting...');
            const result = await saveOrderToSupabase(campaignData, {
                session_id: '',
                customer_email: user.email,
                amount_total: 0,
                currency: 'eur',
            });

            if (!result) {
                showToast('Failed to submit track. Please try again.');
                resetBtn();
                return;
            }

            // Increment tracks_used_this_month
            const token = BeatpushAuth.getToken();
            await fetch(`${BeatpushAuth.supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'apikey': BeatpushAuth.supabaseKey,
                },
                body: JSON.stringify({ tracks_used_this_month: tracksUsed + 1 }),
            });

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('[AlphaStudios] Submit error:', err);
            showToast('Failed to submit track. Please try again.');
            resetBtn();
        }
    } else {
        // No subscription — show pricing card inline, user clicks "Start Free Trial" to go to Stripe
        localStorage.setItem('alphastudios_pending_campaign', JSON.stringify(campaignData));
        resetBtn();

        const inlinePricing = document.getElementById('inlinePricingCard');
        if (inlinePricing) {
            inlinePricing.style.display = '';
            inlinePricing.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ===== Field Highlight =====
function highlightField(el) {
    if (!el) return;
    el.classList.add('field-highlight');
    setTimeout(() => el.classList.remove('field-highlight'), 2000);
}

// ===== Toast Popup =====
function showToast(message, scrollToSearch) {
    // Remove existing toast
    const existing = document.querySelector('.toast-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    overlay.innerHTML = `
        <div class="toast-box">
            <div class="toast-icon">
                <img src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773639380/Dark_Blue_Minimalist_Letter_A_Logo_olmb2b.png" alt="AlphaStudios" class="toast-logo">
            </div>
            <p class="toast-msg">${message}</p>
            <button class="toast-close">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const close = () => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.remove();
            if (scrollToSearch) {
                const searchSection = document.getElementById('search');
                if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 300);
    };

    overlay.querySelector('.toast-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}

// ===== Checkout Success Detection =====
function showPaymentConfirmation(campaign, paymentData) {
    const lang = detectLanguage();
    const t = translations[lang] || translations.en;
    const packLabel = campaign.pack === 'mastering' ? 'Mastering + Feedback + Labels' : campaign.pack;

    // Build artist chips HTML
    const artistsHtml = (campaign.similar_artists || []).map(a => {
        const name = typeof a === 'string' ? a : a.name;
        const img = typeof a === 'string' ? '' : (a.img || '');
        return `<div class="confirm-artist">
            ${img ? `<img src="${escapeHtml(img)}" alt="" class="confirm-artist-img" onerror="this.outerHTML='<div class=\\'confirm-artist-placeholder\\'><svg width=\\'14\\' height=\\'14\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'/><circle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'/></svg></div>'">` : `<div class="confirm-artist-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`}
            <span class="confirm-artist-name">${escapeHtml(name)}</span>
        </div>`;
    }).join('');

    // Fallback if similar_artists is a string
    let artistsFallback = '';
    if (!Array.isArray(campaign.similar_artists) && paymentData?.metadata?.similar_artists) {
        artistsFallback = paymentData.metadata.similar_artists.split(',').map(name =>
            `<div class="confirm-artist"><div class="confirm-artist-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><span class="confirm-artist-name">${escapeHtml(name.trim())}</span></div>`
        ).join('');
    }

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    overlay.innerHTML = `
        <div class="confirm-box">
            <img src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773648385/Black_and_Red_Modern_Initials_A_E-Sport_Gaming_Pictorial_Mark_Logo_hx5o3z.png" alt="AlphaStudios" class="confirm-logo">
            <h2 class="confirm-title">Payment Successful 🎉</h2>
            <p class="confirm-subtitle">Your order has been confirmed. Our team will begin processing your campaign shortly. The average delivery time is 24–48 hours. You can track your order status anytime from your dashboard, where you will also receive the receipt and proof of delivery once the campaign is completed. Thank you for your trust. 🚀</p>

            <div class="confirm-divider"></div>

            ${campaign.track_artwork ? `
            <div class="confirm-track">
                <img src="${escapeHtml(campaign.track_artwork)}" alt="" class="confirm-track-art" onerror="this.style.display='none'">
                <div class="confirm-track-info">
                    <div class="confirm-track-title">${escapeHtml(campaign.track_title)}</div>
                    <div class="confirm-track-artist">${escapeHtml(campaign.track_artist)}</div>
                </div>
            </div>
            ` : campaign.track_title ? `
            <div class="confirm-track">
                <div class="confirm-track-info">
                    <div class="confirm-track-title">${escapeHtml(campaign.track_title)}</div>
                    <div class="confirm-track-artist">${escapeHtml(campaign.track_artist)}</div>
                </div>
            </div>
            ` : ''}

            <div class="confirm-details">
                <div class="confirm-row">
                    <span class="confirm-label">${t.campaign_summary_pack || 'Package'}</span>
                    <span class="confirm-value">${escapeHtml(packLabel)}</span>
                </div>
                ${campaign.genre ? `
                <div class="confirm-row">
                    <span class="confirm-label">Genre</span>
                    <span class="confirm-value">${escapeHtml(campaign.genre)}</span>
                </div>` : ''}
            </div>

            ${(artistsHtml || artistsFallback) ? `
            <div class="confirm-artists-section">
                <span class="confirm-label">${t.campaign_artists_label || 'Similar Artists'}</span>
                <div class="confirm-artists">${artistsHtml || artistsFallback}</div>
            </div>` : ''}

            <button class="confirm-btn">Go to Dashboard</button>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const close = () => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.remove();
            window.location.href = '/dashboard';
        }, 300);
    };
    overlay.querySelector('.confirm-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

// Handle post-checkout return (subscription mode redirects to /dashboard,
// but handle here as fallback for any /?session_id=... landing)
(function() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    // Subscription checkout redirects to /dashboard — redirect there
    window.location.href = `/dashboard?session_id=${encodeURIComponent(sessionId)}`;
})();

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    if (!isOpen) {
        item.classList.add('open');
    }
}

/* Product card info tooltip — hover on desktop, tap on mobile */
(function() {
    const isTouch = 'ontouchstart' in window;

    document.querySelectorAll('.product-card-info').forEach(btn => {
        const card = btn.closest('.product-card');

        if (!isTouch) {
            /* Desktop: hover to show, leave card to hide */
            btn.addEventListener('mouseenter', () => {
                card.classList.add('tooltip-active');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('tooltip-active');
            });
        }

        /* Touch & click: single tap to toggle */
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.toggle('tooltip-active');
        });
    });
})();
