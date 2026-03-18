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
        page_title: 'AlphaStudios - Professional Mastering, Feedback & Label Support for Artists',
        page_desc: 'Professional mastering, expert feedback, and label submission support. AlphaStudios helps artists release music at the highest level.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'Pricing',
        nav_cta: 'GET STARTED',
        nav_login: 'Sign in',
        nav_logout: 'Sign out',
        nav_dashboard: 'Dashboard',
        auth_prompt_title: 'Sign in to continue',
        auth_prompt_text: 'Please sign in with your Google account to proceed with your campaign.',
        auth_google_btn: 'Sign in with Google',
        auth_cancel: 'Cancel',
        dashboard_badge: 'DASHBOARD',
        dashboard_title: 'Studio Dashboard',
        dashboard_desc: 'Your tracks. Your progress. Your sound.',
        dashboard_empty: 'No tracks yet.',
        dashboard_status_completed: 'Completed',
        dashboard_status_progress: 'In Progress',
        dashboard_label_campaign: 'Campaign',
        dashboard_label_genre: 'Genre',
        dashboard_label_date: 'Date',
        dashboard_label_similar: 'Similar Artists',
        dashboard_label_receipt: 'Receipt',
        dashboard_cta: 'Upload your first track',
        dashboard_error: 'Failed to load campaigns.',
        hero_badge: 'Stop sending unfinished demos.',
        hero_title: 'We Turn Your Track <span class="text-gradient">Club</span> & <span class="text-gradient">Label</span> Ready',
        hero_subtitle: 'We help artists reach the highest standards.',
        hero_cta_btn: 'GET STARTED',
        feature_no_bots: 'Detailed Feedback Reports',
        feature_scheduling: 'Professional Mastering',
        feature_strategy: 'Label Submission Support',
        feature_guarantee: 'Demos To Labels',
        upload_badge: 'UPLOAD YOUR TRACK',
        upload_title: 'Upload your track for <span class="text-green">mastering</span>',
        upload_desc: 'Drag & drop or click to upload your audio file.',
        upload_tagline: 'Professional quality. Fast turnaround. Honest feedback.',
        upload_drop_text: 'Drag & drop your audio file here',
        upload_drop_hint: 'or click to browse — See requirements',
        pricing_badge: 'PRICING',
        pricing_title: 'Choose Your <span class="text-green">Package</span>',
        pricing_desc: 'Our packages are designed by experienced engineers and A&R professionals to give your music the best chance of success.',
        choose_btn: 'Choose',
        popular_badge: 'POPULAR',
        change_track: 'Change',
        campaign_badge: 'LET\'S GET INTO DETAILS',
        campaign_title: 'Order Setup',
        campaign_desc: 'Configure your order before submitting.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirm the genre detected for your track.',
        campaign_genre_hint_manual: 'Please type your genre below.',
        campaign_genre_input_placeholder: 'Type your genre (e.g. Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirm',
        campaign_confirmed: 'Confirmed',
        campaign_artists_label: 'Similar Artists (For Reference)',
        campaign_artists_hint: 'Enter 3 artists with a similar style to your track — this helps our engineers understand your sound and target the right labels.',
        campaign_artists_placeholder: 'Select a similar artist',
        campaign_release_label: 'Release Status',
        campaign_release_hint: 'Is your track already released or in pre-order?',
        campaign_released: 'Already Released',
        campaign_preorder: 'Pre-Order',
        campaign_launch_btn: 'Place my order',
        payment_success: 'Payment confirmed!',
        payment_success_sub: 'Your order is being processed. You will receive a confirmation email shortly.\nYou will also receive your deliverables within the timeframe indicated in your package.',
        payment_success_whatsapp_text: "If you'd like to discuss your track, ask a question, or simply stay updated about your order, feel free to reach out.",
        payment_success_whatsapp_btn: 'Chat with us',
        campaign_tips_title: 'Tips / Requirements',
        card_tooltip_title: 'Tips & Requirements',
        campaign_tip_1: 'For best mastering results, submit high-quality WAV or AIFF files.',
        campaign_tip_2: 'Leave at least -3dB of headroom on your master bus for optimal mastering.',
        campaign_tip_5: 'Feedback sessions are most useful when you share your artistic intent and reference tracks.',
        campaign_tip_6: 'Label submissions perform better when your artist profile is complete with a bio and photo.',
        campaign_tip_7: 'Turnaround times may vary depending on the complexity of the project and the package selected.',
        campaign_tip_8: 'Our team reviews every submission carefully — quality is our top priority.',
        dailypush_tip_1: '',
        dailypush_tip_2: '',
        dailypush_tip_3: '',
        top100_tooltip_title: '',
        top100_tip_1: '',
        top100_tip_2: '',
        top100_tip_3: '',
        top100_tip_4: '',
        top100_tip_5: '',
        top100_tip_6: '',
        top100_tip_7: '',
        top10_tooltip_title: '',
        top10_tip_1: '',
        top10_tip_2: '',
        top10_tip_3: '',
        top10_tip_4: '',
        top10_tip_footer_1: '',
        top10_tip_footer_daily_push: '',
        top10_tip_footer_2: '',
        top10_tip_footer_3: '',
        campaign_validate_genre: 'Please confirm the genre of your track before submitting.',
        campaign_validate_artists: 'Please enter at least 1 similar artist.',
        choose_validate_track: 'Please select a track first before choosing a package.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Package',
        campaign_summary_copies: 'copies',
        how_badge: 'OUR PROCESS',
        how_title: 'How AlphaStudios <span class="text-gradient">Works</span>',
        how_step1_title: 'Find Your Track',
        how_step1_desc: 'Search for your track using our search bar and select it.',
        how_step1_detail: 'Our system identifies your track and prepares it for the next step.',
        how_step2_title: 'Choose Your Package',
        how_step2_desc: 'Select the service that fits your needs:',
        how_step2_li1: 'Professional mastering',
        how_step2_li2: 'Expert feedback & review',
        how_step2_li3: 'Label submission support',
        how_step2_li4: 'Combined packages',
        how_step2_detail: 'Each package is tailored to help your music reach its full potential.',
        how_step3_title: 'We Process Your Order',
        how_step3_desc: 'Our team gets to work on your track.',
        how_step3_bullet1: 'AlphaStudios connects your music with experienced mastering engineers, A&R professionals, and label contacts built over years in the industry.',
        how_step3_bullet2: 'Our team works on your order and keeps you updated on the progress.',
        how_step4_title: 'Receive Your Deliverables',
        how_step4_desc: 'Once complete, you receive:',
        how_step4_li1: 'Mastered audio files',
        how_step4_li2: 'Detailed feedback report',
        how_step4_li3: 'Label submission confirmation',
        how_step4_detail: 'All deliverables are sent directly to your email.',
        how_step5_title: 'Receipts Provided',
        how_step5_desc: 'You will receive receipts and documentation for all services rendered.',
        why_badge: 'WHY ALPHASTUDIOS',
        why_title: 'Why Choose AlphaStudios for Your Music',
        why_subtitle: 'Elevate your sound',
        why_card1_title: 'Studio-Grade Quality',
        why_card1_text: 'All mastering is performed by experienced engineers using industry-standard tools and techniques to ensure your music sounds its best.',
        why_card2_title: 'Professional Service',
        why_card2_text: 'Every order is handled with care and precision. Our team of engineers and A&R professionals brings years of experience to every project.',
        why_card3_title: 'Fast Delivery',
        why_card3_text: 'We understand that timing matters. Our streamlined workflow ensures fast turnaround without compromising on quality.\n\nAll deliverables come with full documentation and support.',
        faq_title: 'Frequently asked questions',
        faq0a_q: 'What happens after I order?',
        faq0a_a: 'Once your order is placed, you will immediately receive an order confirmation email.<br>The process is fast, simple and fully handled by our team.<br><br><strong>Here\'s what happens next:</strong><br><br>1. <strong>Track review</strong> — Our team reviews your track and confirms the audio files are ready for processing.<br>2. <strong>Processing</strong> — Our engineers begin working on your mastering, feedback, or label submission according to your selected package.<br>3. <strong>Quality check</strong> — Every deliverable goes through a quality review before being sent to you.<br>4. <strong>Delivery</strong> — You receive your mastered files, feedback report, or label submission confirmation via email.<br>5. <strong>Completion notification</strong> — Once everything is delivered, you will receive a final confirmation email.<br><br>That\'s it. Sit back and let our professionals handle the rest.',
        faq0b_q: 'What\'s the refund policy?',
        faq0b_a: 'We work hard to ensure every order is completed to the highest standard.<br><br>If your order cannot be fulfilled or the deliverables cannot be provided within the announced timeframe, you may request:<br>• A full refund, or<br>• A replacement service<br><br>Simply contact our support team at any time if you have questions or concerns.<br><br>Our goal is always to provide a transparent, reliable and professional service.',
        faq1_q: 'How long does processing take?',
        faq1_a: 'Most orders are completed within 2–5 business days, depending on the package and current workload.',
        faq2_q: 'What formats do you deliver?',
        faq2_a: 'We deliver mastered tracks in WAV (24-bit) and MP3 (320kbps) formats. Custom formats are available on request.',
        faq3_q: 'Can new artists use the service?',
        faq3_a: 'Yes. We work with independent artists, labels and distributors at every level.',
        faq4_q: 'Do you offer feedback without mastering?',
        faq4_a: 'Yes, we offer standalone feedback packages where our A&R team provides detailed notes on your track\'s mix, arrangement, and market readiness.',
        faq5_q: 'Any tips/requirement?',
        cta_title: 'Ready to elevate your music?',
        cta_desc: 'Join hundreds of artists using AlphaStudios to take their sound to the next level.',
        cta_btn: 'GET STARTED NOW',
        footer_desc: 'Professional mastering, feedback & label support for artists.',
        footer_nav: 'Navigation',
        footer_boost: 'Get started',
        footer_how: 'How it works',
        footer_copy: '&copy; 2026 AlphaStudios. All rights reserved.',
        footer_disclaimer: '',
        footer_terms: 'Terms of Use',
        hero_feature_feedback: 'Professional Feedback',
        hero_feature_mastering: 'Studio Mastering',
        genre_placeholder: 'Select your genre',
        genre_search_placeholder: 'Search...',
        pricing_title_v2: 'Choose your <span class="text-gradient">Plan</span>',
        pricing_desc_v2: 'Start with a free trial. Cancel anytime.',
        pricing_pro_badge: 'PRO PLAN',
        pricing_pro_title: 'Pro Plan',
        pricing_pro_desc: 'Everything you need to release your music professionally.',
        pricing_free_trial: '3-day free trial',
        pricing_feat_1: 'Up to 5 tracks per month',
        pricing_feat_2: 'In-depth feedback from industry professionals',
        pricing_feat_3: 'Premium mastering for a release-ready sound',
        pricing_feat_4: 'Private WhatsApp access to our engineering team',
        pricing_cta: 'Start 3-Day Trial',
        pricing_requirements_btn: 'Submission requirements',
        req_title: 'REQUIREMENTS',
        req_intro: 'To ensure the highest quality results, please follow these guidelines before submitting your track.',
        req_format_title: 'Audio Format',
        req_format_1: 'WAV or AIFF only',
        req_format_2: '24-bit preferred (16-bit minimum)',
        req_format_3: 'Sample rate: 44.1 kHz or higher',
        req_headroom_title: 'Headroom',
        req_headroom_1: 'Leave -6 dB headroom on your master',
        req_headroom_2: 'No clipping',
        req_nolimit_title: 'No Limiting',
        req_nolimit_1: 'Remove any limiter from the master channel',
        req_nolimit_2: 'Avoid heavy compression on the master',
        req_export_title: 'Export Quality',
        req_export_1: 'Export your final mixdown',
        req_export_2: 'No MP3 or compressed formats',
        req_mix_title: 'Mix Balance',
        req_mix_1: 'Proper balance between elements',
        req_mix_2: 'No distorted or over-saturated signals',
        req_mix_3: 'Clean low-end (kick / bass separation)',
        req_version_title: 'Version',
        req_version_1: 'Submit the final version only',
        req_version_2: 'No drafts or unfinished ideas',
        req_optional_title: 'Genre & References',
        req_optional_1: 'Select the genre that best fits your track',
        req_optional_2: 'Reference artist (to help us know what kind of sound we should use for reference)',
        how_desc: 'Simple. Clear. Effective.',
        how_step1_v2: 'Upload your track',
        how_step1_desc_v2: 'Send us your music and let our team take over.',
        how_step2_v2: 'Receive detailed professional feedback',
        how_step2_desc_v2: 'Get precise, actionable insights from industry professionals.',
        how_step3_v2: 'Refine your track',
        how_step3_desc_v2: 'Re-upload your track if you want to apply the improvements and elevate your sound.',
        how_step4_v2: 'Final mastering',
        how_step4_desc_v2: 'Our studio delivers a release-ready master, fitting music industry\'s highest standards.',
        whatwedo_badge: 'WHAT WE DO',
        whatwedo_title: 'Our <span class="text-gradient">Services</span>',
        whatwedo_tagline: 'Every track is treated with time, attention and precision.<br><strong>No automation. No shortcuts.</strong>',
        whatwedo_feedback_title: 'Professional Feedback',
        whatwedo_feedback_desc: 'Your music is reviewed by a committee of industry professionals.',
        whatwedo_feedback_li1: 'Multiple listening sessions',
        whatwedo_feedback_li2: 'Technical + artistic analysis',
        whatwedo_feedback_li3: 'Clear, actionable improvements',
        whatwedo_feedback_li4: 'Honest, precise feedback',
        whatwedo_feedback_footer: 'Our committee is composed of engineers, producers and industry leaders who work — or have worked — with top-tier labels and artists.',
        whatwedo_mastering_title: 'Studio Mastering',
        whatwedo_mastering_desc: 'Once your track is ready, we handle the final mastering.',
        whatwedo_mastering_li1: 'Industry-standard sound',
        whatwedo_mastering_li2: 'Club-ready output',
        whatwedo_mastering_li3: 'Streaming optimized',
        whatwedo_mastering_li4: 'High-end audio quality',
        whatwedo_mastering_footer: 'Your music is mastered by our team, with experience across major labels and international artists.',
        faq_badge: 'FAQ',
        faq1_q_v2: 'What exactly do you offer?',
        faq1_a_v2: '<p>We provide two core services:</p><ul><li>Professional feedback from a committee of industry experts</li><li>High-end mastering handled by our team</li></ul><p>Our goal is simple: elevate your track to a professional, release-ready standard.</p>',
        faq2_q_v2: 'Who reviews my music?',
        faq2_a_v2: '<p>Your track is reviewed by a committee of professionals including:</p><ul><li>Sound engineers</li><li>Producers</li><li>Industry decision-makers</li></ul><p>All members have experience working with top-tier labels and artists.</p>',
        faq3_q_v2: 'How detailed is the feedback?',
        faq3_a_v2: '<p>We provide structured, actionable feedback, not generic comments. You will receive:</p><ul><li>Technical analysis (mix, balance, structure)</li><li>Artistic direction</li><li>Precise improvement suggestions</li></ul><p>Every track is listened to multiple times before feedback is delivered.</p>',
        faq4_q_v2: 'How long does it take?',
        faq4_a_v2: '<p>Turnaround time typically ranges between 24 to 72 hours per track.</p><p>Priority is given to monthly Pro users.</p>',
        faq5_q_v2: 'Do I need to send a finished track?',
        faq5_a_v2: '<p>Yes. We only work with final or near-final versions.</p><p>The feedback is designed to refine and elevate — not to build a track from scratch.</p>',
        faq6_q_v2: 'What happens after I receive the feedback?',
        faq6_a_v2: '<p>You can:</p><ol><li>Apply the suggested improvements</li><li>Send us your updated version</li><li>We proceed with the final mastering</li></ol>',
        faq7_q_v2: 'Can I send a revised version?',
        faq7_a_v2: '<p>Yes. The process is designed to allow one improvement cycle before mastering.</p>',
        faq8_q_v2: 'What makes your mastering different?',
        faq8_a_v2: '<p>Our mastering is designed to meet professional release standards. Your track will be:</p><ul><li>Balanced across all listening systems</li><li>Competitive on streaming platforms</li><li>Optimized for clubs and high-volume environments</li></ul><p>We focus on clarity, impact and consistency.</p>',
        faq9_q_v2: 'What file format should I send?',
        faq9_a_v2: '<p>Please send:</p><ul><li>WAV or AIFF</li><li>24-bit preferred</li><li>No limiter on the master</li><li>Minimum -6 dB headroom</li></ul><p>Full requirements are listed above.</p>',
        faq10_q_v2: 'Do you use AI tools?',
        faq10_a_v2: '<p>No. All feedback and mastering are handled by real professionals.</p>',
        faq11_q_v2: 'Can beginners use your service?',
        faq11_a_v2: '<p>Yes — but your track must be structured and properly produced.</p><p>We work best with producers who already have a solid foundation.</p>',
        footer_support: 'Support',
    },
    fr: {
        page_title: 'AlphaStudios - Mastering professionnel, feedback et support label pour artistes',
        page_desc: 'Mastering professionnel, feedback expert et support de soumission aux labels. AlphaStudios aide les artistes à sortir leur musique au plus haut niveau.',
        nav_how: 'COMMENT CA MARCHE',
        nav_pricing: 'Tarifs',
        nav_cta: 'COMMENCER',
        nav_login: 'Connexion',
        nav_logout: 'Déconnexion',
        nav_dashboard: 'Dashboard',
        auth_prompt_title: 'Connectez-vous pour continuer',
        auth_prompt_text: 'Veuillez vous connecter avec votre compte Google pour finaliser votre campagne.',
        auth_google_btn: 'Se connecter avec Google',
        auth_cancel: 'Annuler',
        dashboard_badge: 'DASHBOARD',
        dashboard_title: 'Studio Dashboard',
        dashboard_desc: 'Vos tracks. Votre progression. Votre son.',
        dashboard_empty: 'Aucune track pour le moment.',
        dashboard_status_completed: 'Terminée',
        dashboard_status_progress: 'En cours',
        dashboard_label_campaign: 'Campagne',
        dashboard_label_genre: 'Genre',
        dashboard_label_date: 'Date',
        dashboard_label_similar: 'Artistes similaires',
        dashboard_label_receipt: 'Reçu',
        dashboard_cta: 'Uploadez votre première track',
        dashboard_error: 'Échec du chargement des campagnes.',
        hero_badge: 'Arrêtez d\'envoyer des démos inachevées.',
        hero_title: 'On Rend Votre Track <span class="text-gradient">Club</span> & <span class="text-gradient">Label</span> Ready',
        hero_subtitle: 'We help artists reach the highest standards.',
        hero_cta_btn: 'COMMENCER',
        feature_no_bots: 'Rapports de feedback détaillés',
        feature_scheduling: 'Mastering professionnel',
        feature_strategy: 'Support de soumission aux labels',
        feature_guarantee: 'Demos aux labels',
        upload_badge: 'UPLOADEZ VOTRE TRACK',
        upload_title: 'Uploadez votre track pour le <span class="text-green">mastering</span>',
        upload_desc: 'Glissez-déposez ou cliquez pour uploader votre fichier audio.',
        upload_tagline: 'Qualité professionnelle. Livraison rapide. Feedback honnête.',
        upload_drop_text: 'Glissez-déposez votre fichier audio ici',
        upload_drop_hint: 'ou cliquez pour parcourir — Voir les prérequis',
        pricing_badge: 'TARIFS',
        pricing_title: 'Choisissez Votre <span class="text-green">Forfait</span>',
        pricing_desc: 'Nos forfaits sont conçus par des ingénieurs expérimentés et des professionnels A&R pour donner à votre musique les meilleures chances de succès.',
        choose_btn: 'Choisir',
        popular_badge: 'POPULAIRE',
        change_track: 'Changer',
        campaign_badge: 'ENTRONS DANS LES DÉTAILS',
        campaign_title: 'Configuration de la commande',
        campaign_desc: 'Configurez votre commande avant de la soumettre.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirmez le genre détecté pour votre track.',
        campaign_genre_hint_manual: 'Veuillez taper votre genre ci-dessous.',
        campaign_genre_input_placeholder: 'Tapez votre genre (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmer',
        campaign_confirmed: 'Confirmé',
        campaign_artists_label: 'Artistes similaires (Pour référence)',
        campaign_artists_hint: 'Entrez 3 artistes au style similaire à votre track — cela aide nos ingénieurs à comprendre votre son et à cibler les bons labels.',
        campaign_artists_placeholder: 'Sélectionnez un artiste similaire',
        campaign_release_label: 'Statut de la sortie',
        campaign_release_hint: 'Votre track est-elle déjà sortie ou en pré-commande ?',
        campaign_released: 'Déjà sortie',
        campaign_preorder: 'Pré-commande',
        campaign_launch_btn: 'Passer ma commande',
        payment_success: 'Paiement confirmé !',
        payment_success_sub: 'Votre commande est en cours de traitement. Vous recevrez un email de confirmation sous peu.\nVous recevrez également vos livrables dans le délai indiqué dans votre forfait.',
        payment_success_whatsapp_text: "Si vous souhaitez discuter de votre track, poser une question ou simplement rester informé de votre commande, n'hésitez pas à nous contacter.",
        payment_success_whatsapp_btn: 'Discuter avec nous',
        campaign_tips_title: 'Conseils / Prérequis',
        card_tooltip_title: 'Conseils & Prérequis',
        campaign_tip_1: 'Pour de meilleurs résultats de mastering, soumettez des fichiers WAV ou AIFF de haute qualité.',
        campaign_tip_2: 'Laissez au moins -3dB de marge sur votre bus master pour un mastering optimal.',
        campaign_tip_5: 'Les sessions de feedback sont plus utiles lorsque vous partagez votre intention artistique et des tracks de référence.',
        campaign_tip_6: 'Les soumissions aux labels fonctionnent mieux lorsque votre profil artiste est complet avec une bio et une photo.',
        campaign_tip_7: 'Les délais de livraison peuvent varier selon la complexité du projet et le forfait sélectionné.',
        campaign_tip_8: 'Notre équipe examine chaque soumission avec soin — la qualité est notre priorité absolue.',
        dailypush_tip_1: '',
        dailypush_tip_2: '',
        dailypush_tip_3: '',
        top100_tooltip_title: '',
        top100_tip_1: '',
        top100_tip_2: '',
        top100_tip_3: '',
        top100_tip_4: '',
        top100_tip_5: '',
        top100_tip_6: '',
        top100_tip_7: '',
        top10_tooltip_title: '',
        top10_tip_1: '',
        top10_tip_2: '',
        top10_tip_3: '',
        top10_tip_4: '',
        top10_tip_footer_1: '',
        top10_tip_footer_daily_push: '',
        top10_tip_footer_2: '',
        top10_tip_footer_3: '',
        campaign_validate_genre: 'Veuillez confirmer le genre de votre track avant de soumettre.',
        campaign_validate_artists: 'Veuillez entrer au moins 1 artiste similaire.',
        choose_validate_track: 'Veuillez d\'abord sélectionner une track avant de choisir un forfait.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Forfait',
        campaign_summary_copies: 'copies',
        how_badge: 'NOTRE PROCESSUS',
        how_title: 'Comment AlphaStudios <span class="text-gradient">fonctionne</span>',
        how_step1_title: 'Trouvez votre track',
        how_step1_desc: 'Recherchez votre track via notre barre de recherche et sélectionnez-la.',
        how_step1_detail: 'Notre système identifie votre track et la prépare pour l\'étape suivante.',
        how_step2_title: 'Choisissez votre forfait',
        how_step2_desc: 'Sélectionnez le service adapté à vos besoins :',
        how_step2_li1: 'Mastering professionnel',
        how_step2_li2: 'Feedback & évaluation par des experts',
        how_step2_li3: 'Support de soumission aux labels',
        how_step2_li4: 'Forfaits combinés',
        how_step2_detail: 'Chaque forfait est conçu pour aider votre musique à atteindre son plein potentiel.',
        how_step3_title: 'Nous traitons votre commande',
        how_step3_desc: 'Notre équipe se met au travail sur votre track.',
        how_step3_bullet1: 'AlphaStudios connecte votre musique à des ingénieurs de mastering expérimentés, des professionnels A&R et des contacts labels construits au fil des années dans l\'industrie.',
        how_step3_bullet2: 'Notre équipe travaille sur votre commande et vous tient informé de l\'avancement.',
        how_step4_title: 'Recevez vos livrables',
        how_step4_desc: 'Une fois terminé, vous recevez :',
        how_step4_li1: 'Fichiers audio masterisés',
        how_step4_li2: 'Rapport de feedback détaillé',
        how_step4_li3: 'Confirmation de soumission au label',
        how_step4_detail: 'Tous les livrables sont envoyés directement par email.',
        how_step5_title: 'Reçus fournis',
        how_step5_desc: 'Vous recevrez des reçus et de la documentation pour tous les services rendus.',
        why_badge: 'POURQUOI ALPHASTUDIOS',
        why_title: 'Pourquoi choisir AlphaStudios pour votre musique',
        why_subtitle: 'Élevez votre son',
        why_card1_title: 'Qualité studio professionnelle',
        why_card1_text: 'Tout le mastering est réalisé par des ingénieurs expérimentés utilisant des outils et techniques aux standards de l\'industrie pour que votre musique sonne au mieux.',
        why_card2_title: 'Service professionnel',
        why_card2_text: 'Chaque commande est traitée avec soin et précision. Notre équipe d\'ingénieurs et de professionnels A&R apporte des années d\'expérience à chaque projet.',
        why_card3_title: 'Livraison rapide',
        why_card3_text: 'Nous comprenons que le timing compte. Notre processus optimisé garantit une livraison rapide sans compromis sur la qualité.\n\nTous les livrables sont accompagnés d\'une documentation complète et d\'un support.',
        faq_title: 'Questions fréquentes',
        faq0a_q: 'Que se passe-t-il après ma commande ?',
        faq0a_a: 'Dès que votre commande est passée, vous recevrez immédiatement un email de confirmation.<br>Le processus est rapide, simple et entièrement géré par notre équipe.<br><br><strong>Voici ce qui se passe ensuite :</strong><br><br>1. <strong>Vérification du track</strong> — Notre équipe examine votre track et confirme que les fichiers audio sont prêts pour le traitement.<br>2. <strong>Traitement</strong> — Nos ingénieurs commencent à travailler sur votre mastering, feedback ou soumission au label selon votre forfait sélectionné.<br>3. <strong>Contrôle qualité</strong> — Chaque livrable passe par un contrôle qualité avant de vous être envoyé.<br>4. <strong>Livraison</strong> — Vous recevez vos fichiers masterisés, rapport de feedback ou confirmation de soumission au label par email.<br>5. <strong>Notification de fin</strong> — Une fois tout livré, vous recevrez un email de confirmation final.<br><br>C\'est tout. Installez-vous et laissez nos professionnels s\'occuper du reste.',
        faq0b_q: 'Quelle est la politique de remboursement ?',
        faq0b_a: 'Nous travaillons dur pour garantir que chaque commande soit complétée au plus haut niveau.<br><br>Si votre commande ne peut pas être exécutée ou les livrables ne peuvent pas être fournis dans le délai annoncé, vous pouvez demander :<br>• Un remboursement complet, ou<br>• Un service de remplacement<br><br>Contactez simplement notre équipe support à tout moment si vous avez des questions ou des préoccupations.<br><br>Notre objectif est toujours de fournir un service transparent, fiable et professionnel.',
        faq1_q: 'Combien de temps dure le traitement ?',
        faq1_a: 'La plupart des commandes sont complétées en 2 à 5 jours ouvrables, selon le forfait et la charge de travail actuelle.',
        faq2_q: 'Quels formats livrez-vous ?',
        faq2_a: 'Nous livrons les tracks masterisés en WAV (24-bit) et MP3 (320kbps). Des formats personnalisés sont disponibles sur demande.',
        faq3_q: 'Les nouveaux artistes peuvent-ils utiliser le service ?',
        faq3_a: 'Oui. Nous travaillons avec des artistes indépendants, des labels et des distributeurs à tous les niveaux.',
        faq4_q: 'Proposez-vous du feedback sans mastering ?',
        faq4_a: 'Oui, nous proposons des forfaits de feedback indépendants où notre équipe A&R fournit des notes détaillées sur le mix, l\'arrangement et la préparation au marché de votre track.',
        faq5_q: 'Des conseils / prérequis ?',
        cta_title: 'Prêt à élever votre musique ?',
        cta_desc: 'Rejoignez des centaines d\'artistes qui utilisent AlphaStudios pour amener leur son au niveau supérieur.',
        cta_btn: 'COMMENCER MAINTENANT',
        footer_desc: 'Mastering professionnel, feedback & support label pour artistes.',
        footer_nav: 'Navigation',
        footer_boost: 'Commencer',
        footer_how: 'Comment ça marche',
        footer_copy: '&copy; 2026 AlphaStudios. Tous droits réservés.',
        footer_disclaimer: '',
        footer_terms: 'Conditions d\'utilisation',
        hero_feature_feedback: 'Feedback Professionnel',
        hero_feature_mastering: 'Mastering Studio',
        genre_placeholder: 'Sélectionnez votre genre',
        genre_search_placeholder: 'Rechercher...',
        pricing_title_v2: 'Choisissez votre <span class="text-gradient">Plan</span>',
        pricing_desc_v2: 'Commencez avec un essai gratuit. Annulez à tout moment.',
        pricing_pro_badge: 'PLAN PRO',
        pricing_pro_title: 'Plan Pro',
        pricing_pro_desc: 'Tout ce dont vous avez besoin pour sortir votre musique professionnellement.',
        pricing_free_trial: 'Essai gratuit de 3 jours',
        pricing_feat_1: 'Jusqu\'à 5 tracks par mois',
        pricing_feat_2: 'Feedback approfondi de professionnels de l\'industrie',
        pricing_feat_3: 'Mastering premium pour un son prêt à sortir',
        pricing_feat_4: 'Accès WhatsApp privé à notre équipe d\'ingénieurs',
        pricing_cta: 'Commencer l\'essai gratuit',
        pricing_requirements_btn: 'Prérequis de soumission',
        req_title: 'PRÉREQUIS',
        req_intro: 'Pour garantir les meilleurs résultats, veuillez suivre ces directives avant de soumettre votre track.',
        req_format_title: 'Format Audio',
        req_format_1: 'WAV ou AIFF uniquement',
        req_format_2: '24-bit recommandé (16-bit minimum)',
        req_format_3: 'Taux d\'échantillonnage : 44.1 kHz ou supérieur',
        req_headroom_title: 'Headroom',
        req_headroom_1: 'Laissez -6 dB de headroom sur votre master',
        req_headroom_2: 'Pas de clipping',
        req_nolimit_title: 'Pas de Limiteur',
        req_nolimit_1: 'Retirez tout limiteur du canal master',
        req_nolimit_2: 'Évitez la compression excessive sur le master',
        req_export_title: 'Qualité d\'Export',
        req_export_1: 'Exportez votre mixdown final',
        req_export_2: 'Pas de MP3 ou formats compressés',
        req_mix_title: 'Équilibre du Mix',
        req_mix_1: 'Bon équilibre entre les éléments',
        req_mix_2: 'Pas de signaux distordus ou sur-saturés',
        req_mix_3: 'Bas propres (séparation kick / basse)',
        req_version_title: 'Version',
        req_version_1: 'Soumettez la version finale uniquement',
        req_version_2: 'Pas de brouillons ou d\'idées inachevées',
        req_optional_title: 'Genre & Références',
        req_optional_1: 'Sélectionnez le genre qui correspond le mieux à votre track',
        req_optional_2: 'Artiste de référence (pour nous aider à savoir quel type de son utiliser comme référence)',
        how_desc: 'Simple. Clair. Efficace.',
        how_step1_v2: 'Uploadez votre track',
        how_step1_desc_v2: 'Envoyez-nous votre musique et laissez notre équipe prendre le relais.',
        how_step2_v2: 'Recevez un feedback professionnel détaillé',
        how_step2_desc_v2: 'Obtenez des conseils précis et actionnables de professionnels de l\'industrie.',
        how_step3_v2: 'Affinez votre track',
        how_step3_desc_v2: 'Re-uploadez votre track si vous souhaitez appliquer les améliorations et sublimer votre son.',
        how_step4_v2: 'Mastering final',
        how_step4_desc_v2: 'Notre studio livre un master prêt à sortir, aux plus hauts standards de l\'industrie musicale.',
        whatwedo_badge: 'NOS SERVICES',
        whatwedo_title: 'Nos <span class="text-gradient">Services</span>',
        whatwedo_tagline: 'Chaque track est traitée avec du temps, de l\'attention et de la précision.<br><strong>Pas d\'automatisation. Pas de raccourcis.</strong>',
        whatwedo_feedback_title: 'Feedback Professionnel',
        whatwedo_feedback_desc: 'Votre musique est évaluée par un comité de professionnels de l\'industrie.',
        whatwedo_feedback_li1: 'Sessions d\'écoute multiples',
        whatwedo_feedback_li2: 'Analyse technique + artistique',
        whatwedo_feedback_li3: 'Améliorations claires et concrètes',
        whatwedo_feedback_li4: 'Feedback honnête et précis',
        whatwedo_feedback_footer: 'Notre comité est composé d\'ingénieurs, de producteurs et de leaders de l\'industrie qui travaillent — ou ont travaillé — avec des labels et artistes de premier plan.',
        whatwedo_mastering_title: 'Mastering Studio',
        whatwedo_mastering_desc: 'Une fois votre track prête, nous gérons le mastering final.',
        whatwedo_mastering_li1: 'Son aux standards de l\'industrie',
        whatwedo_mastering_li2: 'Résultat prêt pour les clubs',
        whatwedo_mastering_li3: 'Optimisé pour le streaming',
        whatwedo_mastering_li4: 'Qualité audio haut de gamme',
        whatwedo_mastering_footer: 'Votre musique est masterisée par notre équipe, avec une expérience auprès de labels majeurs et d\'artistes internationaux.',
        faq_badge: 'FAQ',
        faq1_q_v2: 'Que proposez-vous exactement ?',
        faq1_a_v2: '<p>Nous proposons deux services principaux :</p><ul><li>Feedback professionnel par un comité d\'experts de l\'industrie</li><li>Mastering haut de gamme réalisé par notre équipe</li></ul><p>Notre objectif est simple : élever votre track à un standard professionnel, prêt pour la sortie.</p>',
        faq2_q_v2: 'Qui évalue ma musique ?',
        faq2_a_v2: '<p>Votre track est évaluée par un comité de professionnels incluant :</p><ul><li>Ingénieurs du son</li><li>Producteurs</li><li>Décideurs de l\'industrie</li></ul><p>Tous les membres ont de l\'expérience avec des labels et artistes de premier plan.</p>',
        faq3_q_v2: 'Le feedback est-il détaillé ?',
        faq3_a_v2: '<p>Nous fournissons un feedback structuré et actionnable, pas des commentaires génériques. Vous recevrez :</p><ul><li>Analyse technique (mix, équilibre, structure)</li><li>Direction artistique</li><li>Suggestions d\'amélioration précises</li></ul><p>Chaque track est écoutée plusieurs fois avant que le feedback ne soit livré.</p>',
        faq4_q_v2: 'Combien de temps cela prend-il ?',
        faq4_a_v2: '<p>Le délai de traitement est généralement de 24 à 72 heures par track.</p><p>La priorité est donnée aux utilisateurs Pro mensuels.</p>',
        faq5_q_v2: 'Dois-je envoyer une track terminée ?',
        faq5_a_v2: '<p>Oui. Nous travaillons uniquement avec des versions finales ou quasi-finales.</p><p>Le feedback est conçu pour affiner et élever — pas pour construire une track de zéro.</p>',
        faq6_q_v2: 'Que se passe-t-il après avoir reçu le feedback ?',
        faq6_a_v2: '<p>Vous pouvez :</p><ol><li>Appliquer les améliorations suggérées</li><li>Nous envoyer votre version mise à jour</li><li>Nous procédons au mastering final</li></ol>',
        faq7_q_v2: 'Puis-je envoyer une version révisée ?',
        faq7_a_v2: '<p>Oui. Le processus est conçu pour permettre un cycle d\'amélioration avant le mastering.</p>',
        faq8_q_v2: 'Qu\'est-ce qui rend votre mastering différent ?',
        faq8_a_v2: '<p>Notre mastering est conçu pour répondre aux standards professionnels de sortie. Votre track sera :</p><ul><li>Équilibrée sur tous les systèmes d\'écoute</li><li>Compétitive sur les plateformes de streaming</li><li>Optimisée pour les clubs et les environnements à fort volume</li></ul><p>Nous nous concentrons sur la clarté, l\'impact et la cohérence.</p>',
        faq9_q_v2: 'Quel format de fichier dois-je envoyer ?',
        faq9_a_v2: '<p>Veuillez envoyer :</p><ul><li>WAV ou AIFF</li><li>24-bit recommandé</li><li>Pas de limiteur sur le master</li><li>Minimum -6 dB de headroom</li></ul><p>Les prérequis complets sont listés ci-dessus.</p>',
        faq10_q_v2: 'Utilisez-vous des outils IA ?',
        faq10_a_v2: '<p>Non. Tout le feedback et le mastering sont réalisés par de vrais professionnels.</p>',
        faq11_q_v2: 'Les débutants peuvent-ils utiliser votre service ?',
        faq11_a_v2: '<p>Oui — mais votre track doit être structurée et correctement produite.</p><p>Nous travaillons mieux avec des producteurs qui ont déjà une base solide.</p>',
        footer_support: 'Support',
    },
    pt: {
        page_title: 'AlphaStudios - Masterização profissional, feedback e suporte de labels para artistas',
        page_desc: 'Masterização profissional, feedback especializado e suporte de submissão para labels. AlphaStudios ajuda artistas a lançar música no mais alto nível.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'Preços',
        nav_cta: 'COMEÇAR',
        nav_login: 'Entrar',
        nav_logout: 'Sair',
        nav_dashboard: 'Dashboard',
        auth_prompt_title: 'Entre para continuar',
        auth_prompt_text: 'Por favor, entre com sua conta Google para prosseguir com sua campanha.',
        auth_google_btn: 'Entrar com Google',
        auth_cancel: 'Cancelar',
        dashboard_badge: 'DASHBOARD',
        dashboard_title: 'Studio Dashboard',
        dashboard_desc: 'Suas tracks. Seu progresso. Seu som.',
        dashboard_empty: 'Nenhuma track ainda.',
        dashboard_status_completed: 'Concluída',
        dashboard_status_progress: 'Em andamento',
        dashboard_label_campaign: 'Campanha',
        dashboard_label_genre: 'Gênero',
        dashboard_label_date: 'Data',
        dashboard_label_similar: 'Artistas semelhantes',
        dashboard_label_receipt: 'Recibo',
        dashboard_cta: 'Envie sua primeira track',
        dashboard_error: 'Falha ao carregar campanhas.',
        hero_badge: 'Pare de enviar demos inacabadas.',
        hero_title: 'Deixamos Sua Track <span class="text-gradient">Club</span> & <span class="text-gradient">Label</span> Ready',
        hero_subtitle: 'We help artists reach the highest standards.',
        hero_cta_btn: 'COMEÇAR',
        feature_no_bots: 'Relatórios de feedback detalhados',
        feature_scheduling: 'Mastering profissional',
        feature_strategy: 'Suporte de submissão para labels',
        feature_guarantee: 'Demos para labels',
        upload_badge: 'ENVIE SUA TRACK',
        upload_title: 'Envie sua track para <span class="text-green">mastering</span>',
        upload_desc: 'Arraste e solte ou clique para enviar seu arquivo de áudio.',
        upload_tagline: 'Qualidade profissional. Entrega rápida. Feedback honesto.',
        upload_drop_text: 'Arraste e solte seu arquivo de áudio aqui',
        upload_drop_hint: 'ou clique para navegar — Ver requisitos',
        pricing_badge: 'PREÇOS',
        pricing_title: 'Escolha Seu <span class="text-green">Pacote</span>',
        pricing_desc: 'Nossos pacotes são desenvolvidos por engenheiros experientes e profissionais de A&R para dar à sua música as melhores chances de sucesso.',
        choose_btn: 'Escolher',
        popular_badge: 'POPULAR',
        change_track: 'Alterar',
        campaign_badge: 'VAMOS AOS DETALHES',
        campaign_title: 'Configuração do pedido',
        campaign_desc: 'Configure seu pedido antes de enviar.',
        campaign_genre_label: 'Gênero',
        campaign_genre_hint: 'Confirme o gênero detectado para sua track.',
        campaign_genre_hint_manual: 'Por favor, digite seu gênero abaixo.',
        campaign_genre_input_placeholder: 'Digite seu gênero (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares (Para referência)',
        campaign_artists_hint: 'Insira 3 artistas com estilo similar ao da sua track — isso ajuda nossos engenheiros a entender seu som e direcionar os labels certos.',
        campaign_artists_placeholder: 'Selecione um artista similar',
        campaign_release_label: 'Status do lançamento',
        campaign_release_hint: 'Sua track já foi lançada ou está em pré-venda?',
        campaign_released: 'Já lançada',
        campaign_preorder: 'Pré-venda',
        campaign_launch_btn: 'Fazer meu pedido',
        payment_success: 'Pagamento confirmado!',
        payment_success_sub: 'Seu pedido está sendo processado. Você receberá um email de confirmação em breve.\nVocê também receberá seus entregáveis dentro do prazo indicado no seu pacote.',
        payment_success_whatsapp_text: 'Se você quiser discutir sua track, fazer uma pergunta ou simplesmente acompanhar seu pedido, fique à vontade para entrar em contato.',
        payment_success_whatsapp_btn: 'Fale conosco',
        campaign_tips_title: 'Dicas / Requisitos',
        card_tooltip_title: 'Dicas & Requisitos',
        campaign_tip_1: 'Para melhores resultados de masterização, envie arquivos WAV ou AIFF de alta qualidade.',
        campaign_tip_2: 'Deixe pelo menos -3dB de headroom no seu master bus para uma masterização ideal.',
        campaign_tip_5: 'As sessões de feedback são mais úteis quando você compartilha sua intenção artística e tracks de referência.',
        campaign_tip_6: 'As submissões para labels funcionam melhor quando seu perfil de artista está completo com bio e foto.',
        campaign_tip_7: 'Os prazos de entrega podem variar dependendo da complexidade do projeto e do pacote selecionado.',
        campaign_tip_8: 'Nossa equipe analisa cada submissão com cuidado — qualidade é nossa prioridade máxima.',
        dailypush_tip_1: '',
        dailypush_tip_2: '',
        dailypush_tip_3: '',
        top100_tooltip_title: '',
        top100_tip_1: '',
        top100_tip_2: '',
        top100_tip_3: '',
        top100_tip_4: '',
        top100_tip_5: '',
        top100_tip_6: '',
        top100_tip_7: '',
        top10_tooltip_title: '',
        top10_tip_1: '',
        top10_tip_2: '',
        top10_tip_3: '',
        top10_tip_4: '',
        top10_tip_footer_1: '',
        top10_tip_footer_daily_push: '',
        top10_tip_footer_2: '',
        top10_tip_footer_3: '',
        campaign_validate_genre: 'Por favor, confirme o gênero da sua track antes de enviar.',
        campaign_validate_artists: 'Por favor, insira pelo menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecione uma track antes de escolher um pacote.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Pacote',
        campaign_summary_copies: 'cópias',
        how_badge: 'NOSSO PROCESSO',
        how_title: 'Como o AlphaStudios <span class="text-gradient">funciona</span>',
        how_step1_title: 'Encontre sua track',
        how_step1_desc: 'Pesquise sua track usando nossa barra de pesquisa e selecione-a.',
        how_step1_detail: 'Nosso sistema identifica sua track e a prepara para a próxima etapa.',
        how_step2_title: 'Escolha seu pacote',
        how_step2_desc: 'Selecione o serviço que atende às suas necessidades:',
        how_step2_li1: 'Masterização profissional',
        how_step2_li2: 'Feedback & avaliação por especialistas',
        how_step2_li3: 'Suporte de submissão para labels',
        how_step2_li4: 'Pacotes combinados',
        how_step2_detail: 'Cada pacote é desenvolvido para ajudar sua música a alcançar seu pleno potencial.',
        how_step3_title: 'Nós processamos seu pedido',
        how_step3_desc: 'Nossa equipe começa a trabalhar na sua track.',
        how_step3_bullet1: 'AlphaStudios conecta sua música a engenheiros de masterização experientes, profissionais de A&R e contatos de labels construídos ao longo de anos na indústria.',
        how_step3_bullet2: 'Nossa equipe trabalha no seu pedido e mantém você atualizado sobre o progresso.',
        how_step4_title: 'Receba seus entregáveis',
        how_step4_desc: 'Uma vez concluído, você recebe:',
        how_step4_li1: 'Arquivos de áudio masterizados',
        how_step4_li2: 'Relatório de feedback detalhado',
        how_step4_li3: 'Confirmação de submissão ao label',
        how_step4_detail: 'Todos os entregáveis são enviados diretamente por email.',
        how_step5_title: 'Recibos fornecidos',
        how_step5_desc: 'Você receberá recibos e documentação de todos os serviços prestados.',
        why_badge: 'POR QUE ALPHASTUDIOS',
        why_title: 'Por que escolher o AlphaStudios para sua música',
        why_subtitle: 'Eleve seu som',
        why_card1_title: 'Qualidade de estúdio profissional',
        why_card1_text: 'Toda masterização é realizada por engenheiros experientes usando ferramentas e técnicas padrão da indústria para garantir que sua música soe o melhor possível.',
        why_card2_title: 'Serviço profissional',
        why_card2_text: 'Cada pedido é tratado com cuidado e precisão. Nossa equipe de engenheiros e profissionais de A&R traz anos de experiência para cada projeto.',
        why_card3_title: 'Entrega rápida',
        why_card3_text: 'Entendemos que o timing importa. Nosso fluxo de trabalho otimizado garante entrega rápida sem comprometer a qualidade.\n\nTodos os entregáveis vêm com documentação completa e suporte.',
        faq_title: 'Perguntas frequentes',
        faq0a_q: 'O que acontece depois que eu faço o pedido?',
        faq0a_a: 'Assim que seu pedido for feito, você receberá imediatamente um email de confirmação.<br>O processo é rápido, simples e totalmente gerenciado pela nossa equipe.<br><br><strong>Veja o que acontece a seguir:</strong><br><br>1. <strong>Verificação do track</strong> — Nossa equipe analisa seu track e confirma que os arquivos de áudio estão prontos para processamento.<br>2. <strong>Processamento</strong> — Nossos engenheiros começam a trabalhar na sua masterização, feedback ou submissão ao label conforme o pacote selecionado.<br>3. <strong>Controle de qualidade</strong> — Cada entregável passa por uma revisão de qualidade antes de ser enviado a você.<br>4. <strong>Entrega</strong> — Você recebe seus arquivos masterizados, relatório de feedback ou confirmação de submissão ao label por email.<br>5. <strong>Notificação de conclusão</strong> — Quando tudo for entregue, você receberá um email de confirmação final.<br><br>Só isso. Relaxe e deixe nossos profissionais cuidarem do resto.',
        faq0b_q: 'Qual é a política de reembolso?',
        faq0b_a: 'Trabalhamos duro para garantir que cada pedido seja concluído no mais alto padrão.<br><br>Se seu pedido não puder ser cumprido ou os entregáveis não puderem ser fornecidos no prazo anunciado, você pode solicitar:<br>• Um reembolso total, ou<br>• Um serviço substituto<br><br>Entre em contato com nossa equipe de suporte a qualquer momento.<br><br>Nosso objetivo é sempre fornecer um serviço transparente, confiável e profissional.',
        faq1_q: 'Quanto tempo leva o processamento?',
        faq1_a: 'A maioria dos pedidos é concluída em 2 a 5 dias úteis, dependendo do pacote e da carga de trabalho atual.',
        faq2_q: 'Quais formatos vocês entregam?',
        faq2_a: 'Entregamos tracks masterizados em WAV (24-bit) e MP3 (320kbps). Formatos personalizados estão disponíveis sob demanda.',
        faq3_q: 'Novos artistas podem usar o serviço?',
        faq3_a: 'Sim. Trabalhamos com artistas independentes, labels e distribuidores em todos os níveis.',
        faq4_q: 'Vocês oferecem feedback sem masterização?',
        faq4_a: 'Sim, oferecemos pacotes de feedback independentes onde nossa equipe de A&R fornece notas detalhadas sobre o mix, arranjo e prontidão de mercado da sua track.',
        faq5_q: 'Alguma dica / requisito?',
        cta_title: 'Pronto para elevar sua música?',
        cta_desc: 'Junte-se a centenas de artistas que usam o AlphaStudios para levar seu som ao próximo nível.',
        cta_btn: 'COMEÇAR AGORA',
        footer_desc: 'Masterização profissional, feedback & suporte de labels para artistas.',
        footer_nav: 'Navegação',
        footer_boost: 'Começar',
        footer_how: 'Como funciona',
        footer_copy: '&copy; 2026 AlphaStudios. Todos os direitos reservados.',
        footer_disclaimer: '',
        footer_terms: 'Termos de Uso',
        hero_feature_feedback: 'Feedback Profissional',
        hero_feature_mastering: 'Mastering de Estúdio',
        genre_placeholder: 'Selecione seu gênero',
        genre_search_placeholder: 'Pesquisar...',
        pricing_title_v2: 'Escolha seu <span class="text-gradient">Plano</span>',
        pricing_desc_v2: 'Comece com um teste gratuito. Cancele a qualquer momento.',
        pricing_pro_badge: 'PLANO PRO',
        pricing_pro_title: 'Plano Pro',
        pricing_pro_desc: 'Tudo que você precisa para lançar sua música profissionalmente.',
        pricing_free_trial: 'Teste gratuito de 3 dias',
        pricing_feat_1: 'Até 5 tracks por mês',
        pricing_feat_2: 'Feedback aprofundado de profissionais da indústria',
        pricing_feat_3: 'Masterização premium para um som pronto para lançamento',
        pricing_feat_4: 'Acesso privado ao WhatsApp da nossa equipe de engenheiros',
        pricing_cta: 'Iniciar teste gratuito',
        pricing_requirements_btn: 'Requisitos de envio',
        req_title: 'REQUISITOS',
        req_intro: 'Para garantir os melhores resultados, siga estas diretrizes antes de enviar sua track.',
        req_format_title: 'Formato de Áudio',
        req_format_1: 'Apenas WAV ou AIFF',
        req_format_2: '24-bit preferido (16-bit mínimo)',
        req_format_3: 'Taxa de amostragem: 44.1 kHz ou superior',
        req_headroom_title: 'Headroom',
        req_headroom_1: 'Deixe -6 dB de headroom no seu master',
        req_headroom_2: 'Sem clipping',
        req_nolimit_title: 'Sem Limitador',
        req_nolimit_1: 'Remova qualquer limitador do canal master',
        req_nolimit_2: 'Evite compressão pesada no master',
        req_export_title: 'Qualidade de Exportação',
        req_export_1: 'Exporte seu mixdown final',
        req_export_2: 'Sem MP3 ou formatos comprimidos',
        req_mix_title: 'Equilíbrio do Mix',
        req_mix_1: 'Equilíbrio adequado entre elementos',
        req_mix_2: 'Sem sinais distorcidos ou sobre-saturados',
        req_mix_3: 'Grave limpo (separação kick / baixo)',
        req_version_title: 'Versão',
        req_version_1: 'Envie apenas a versão final',
        req_version_2: 'Sem rascunhos ou ideias inacabadas',
        req_optional_title: 'Gênero & Referências',
        req_optional_1: 'Selecione o gênero que melhor se encaixa na sua track',
        req_optional_2: 'Artista de referência (para nos ajudar a saber que tipo de som usar como referência)',
        how_desc: 'Simples. Claro. Eficaz.',
        how_step1_v2: 'Envie sua track',
        how_step1_desc_v2: 'Envie sua música e deixe nossa equipe cuidar do resto.',
        how_step2_v2: 'Receba feedback profissional detalhado',
        how_step2_desc_v2: 'Obtenha insights precisos e acionáveis de profissionais da indústria.',
        how_step3_v2: 'Refine sua track',
        how_step3_desc_v2: 'Re-envie sua track se quiser aplicar as melhorias e elevar seu som.',
        how_step4_v2: 'Masterização final',
        how_step4_desc_v2: 'Nosso estúdio entrega um master pronto para lançamento, nos mais altos padrões da indústria musical.',
        whatwedo_badge: 'O QUE FAZEMOS',
        whatwedo_title: 'Nossos <span class="text-gradient">Serviços</span>',
        whatwedo_tagline: 'Cada track é tratada com tempo, atenção e precisão.<br><strong>Sem automação. Sem atalhos.</strong>',
        whatwedo_feedback_title: 'Feedback Profissional',
        whatwedo_feedback_desc: 'Sua música é avaliada por um comitê de profissionais da indústria.',
        whatwedo_feedback_li1: 'Múltiplas sessões de escuta',
        whatwedo_feedback_li2: 'Análise técnica + artística',
        whatwedo_feedback_li3: 'Melhorias claras e acionáveis',
        whatwedo_feedback_li4: 'Feedback honesto e preciso',
        whatwedo_feedback_footer: 'Nosso comitê é composto por engenheiros, produtores e líderes da indústria que trabalham — ou trabalharam — com labels e artistas de primeiro nível.',
        whatwedo_mastering_title: 'Mastering de Estúdio',
        whatwedo_mastering_desc: 'Quando sua track estiver pronta, nós cuidamos do mastering final.',
        whatwedo_mastering_li1: 'Som padrão da indústria',
        whatwedo_mastering_li2: 'Resultado pronto para clubs',
        whatwedo_mastering_li3: 'Otimizado para streaming',
        whatwedo_mastering_li4: 'Qualidade de áudio premium',
        whatwedo_mastering_footer: 'Sua música é masterizada pela nossa equipe, com experiência em grandes labels e artistas internacionais.',
        faq_badge: 'FAQ',
        faq1_q_v2: 'O que exatamente vocês oferecem?',
        faq1_a_v2: '<p>Oferecemos dois serviços principais:</p><ul><li>Feedback profissional de um comitê de especialistas da indústria</li><li>Mastering premium realizado pela nossa equipe</li></ul><p>Nosso objetivo é simples: elevar sua track a um padrão profissional, pronto para lançamento.</p>',
        faq2_q_v2: 'Quem avalia minha música?',
        faq2_a_v2: '<p>Sua track é avaliada por um comitê de profissionais incluindo:</p><ul><li>Engenheiros de som</li><li>Produtores</li><li>Tomadores de decisão da indústria</li></ul><p>Todos os membros têm experiência com labels e artistas de primeiro nível.</p>',
        faq3_q_v2: 'O feedback é detalhado?',
        faq3_a_v2: '<p>Fornecemos feedback estruturado e acionável, não comentários genéricos. Você receberá:</p><ul><li>Análise técnica (mix, equilíbrio, estrutura)</li><li>Direção artística</li><li>Sugestões de melhoria precisas</li></ul><p>Cada track é ouvida várias vezes antes do feedback ser entregue.</p>',
        faq4_q_v2: 'Quanto tempo demora?',
        faq4_a_v2: '<p>O prazo geralmente varia de 24 a 72 horas por track.</p><p>Prioridade é dada aos usuários Pro mensais.</p>',
        faq5_q_v2: 'Preciso enviar uma track finalizada?',
        faq5_a_v2: '<p>Sim. Trabalhamos apenas com versões finais ou quase finais.</p><p>O feedback é projetado para refinar e elevar — não para construir uma track do zero.</p>',
        faq6_q_v2: 'O que acontece depois de receber o feedback?',
        faq6_a_v2: '<p>Você pode:</p><ol><li>Aplicar as melhorias sugeridas</li><li>Nos enviar sua versão atualizada</li><li>Nós procedemos com o mastering final</li></ol>',
        faq7_q_v2: 'Posso enviar uma versão revisada?',
        faq7_a_v2: '<p>Sim. O processo é projetado para permitir um ciclo de melhoria antes do mastering.</p>',
        faq8_q_v2: 'O que torna seu mastering diferente?',
        faq8_a_v2: '<p>Nosso mastering é projetado para atender aos padrões profissionais de lançamento. Sua track será:</p><ul><li>Equilibrada em todos os sistemas de escuta</li><li>Competitiva nas plataformas de streaming</li><li>Otimizada para clubs e ambientes de alto volume</li></ul><p>Focamos em clareza, impacto e consistência.</p>',
        faq9_q_v2: 'Qual formato de arquivo devo enviar?',
        faq9_a_v2: '<p>Por favor envie:</p><ul><li>WAV ou AIFF</li><li>24-bit preferido</li><li>Sem limitador no master</li><li>Mínimo -6 dB de headroom</li></ul><p>Os requisitos completos estão listados acima.</p>',
        faq10_q_v2: 'Vocês usam ferramentas de IA?',
        faq10_a_v2: '<p>Não. Todo feedback e mastering são realizados por profissionais reais.</p>',
        faq11_q_v2: 'Iniciantes podem usar o serviço?',
        faq11_a_v2: '<p>Sim — mas sua track deve ser estruturada e devidamente produzida.</p><p>Trabalhamos melhor com produtores que já têm uma base sólida.</p>',
        footer_support: 'Suporte',
    },
    es: {
        page_title: 'AlphaStudios - Masterización profesional, feedback y soporte de sellos para artistas',
        page_desc: 'Masterización profesional, feedback experto y soporte de envío a sellos. AlphaStudios ayuda a los artistas a lanzar música al más alto nivel.',
        nav_how: 'CÓMO FUNCIONA',
        nav_pricing: 'Precios',
        nav_cta: 'EMPEZAR',
        nav_login: 'Iniciar sesión',
        nav_logout: 'Cerrar sesión',
        nav_dashboard: 'Dashboard',
        auth_prompt_title: 'Inicia sesión para continuar',
        auth_prompt_text: 'Por favor, inicia sesión con tu cuenta de Google para continuar con tu campaña.',
        auth_google_btn: 'Iniciar sesión con Google',
        auth_cancel: 'Cancelar',
        dashboard_badge: 'DASHBOARD',
        dashboard_title: 'Studio Dashboard',
        dashboard_desc: 'Tus tracks. Tu progreso. Tu sonido.',
        dashboard_empty: 'Aún no hay tracks.',
        dashboard_status_completed: 'Completada',
        dashboard_status_progress: 'En curso',
        dashboard_label_campaign: 'Campaña',
        dashboard_label_genre: 'Género',
        dashboard_label_date: 'Fecha',
        dashboard_label_similar: 'Artistas similares',
        dashboard_label_receipt: 'Recibo',
        dashboard_cta: 'Sube tu primera track',
        dashboard_error: 'Error al cargar las campañas.',
        hero_badge: 'Deja de enviar demos sin terminar.',
        hero_title: 'Hacemos Tu Track <span class="text-gradient">Club</span> & <span class="text-gradient">Label</span> Ready',
        hero_subtitle: 'We help artists reach the highest standards.',
        hero_cta_btn: 'EMPEZAR',
        feature_no_bots: 'Informes de feedback detallados',
        feature_scheduling: 'Mastering profesional',
        feature_strategy: 'Soporte de envío a sellos',
        feature_guarantee: 'Demos a sellos',
        upload_badge: 'SUBE TU TRACK',
        upload_title: 'Sube tu track para <span class="text-green">mastering</span>',
        upload_desc: 'Arrastra y suelta o haz clic para subir tu archivo de audio.',
        upload_tagline: 'Calidad profesional. Entrega rápida. Feedback honesto.',
        upload_drop_text: 'Arrastra y suelta tu archivo de audio aquí',
        upload_drop_hint: 'o haz clic para explorar — Ver requisitos',
        pricing_badge: 'PRECIOS',
        pricing_title: 'Elige Tu <span class="text-green">Paquete</span>',
        pricing_desc: 'Nuestros paquetes están diseñados por ingenieros experimentados y profesionales de A&R para darle a tu música las mejores oportunidades de éxito.',
        choose_btn: 'Elegir',
        popular_badge: 'POPULAR',
        change_track: 'Cambiar',
        campaign_badge: 'ENTREMOS EN DETALLES',
        campaign_title: 'Configuración del pedido',
        campaign_desc: 'Configura tu pedido antes de enviarlo.',
        campaign_genre_label: 'Género',
        campaign_genre_hint: 'Confirma el género detectado para tu track.',
        campaign_genre_hint_manual: 'Por favor, escribe tu género a continuación.',
        campaign_genre_input_placeholder: 'Escribe tu género (ej: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares (Como referencia)',
        campaign_artists_hint: 'Ingresa 3 artistas con estilo similar al de tu track — esto ayuda a nuestros ingenieros a entender tu sonido y dirigirse a los sellos adecuados.',
        campaign_artists_placeholder: 'Selecciona un artista similar',
        campaign_release_label: 'Estado del lanzamiento',
        campaign_release_hint: '¿Tu track ya fue lanzada o está en preventa?',
        campaign_released: 'Ya lanzada',
        campaign_preorder: 'Preventa',
        campaign_launch_btn: 'Hacer mi pedido',
        payment_success: '¡Pago confirmado!',
        payment_success_sub: 'Tu pedido se está procesando. Recibirás un email de confirmación en breve.\nTambién recibirás tus entregables dentro del plazo indicado en tu paquete.',
        payment_success_whatsapp_text: 'Si deseas hablar sobre tu track, hacer una pregunta o simplemente mantenerte informado sobre tu pedido, no dudes en contactarnos.',
        payment_success_whatsapp_btn: 'Chatea con nosotros',
        campaign_tips_title: 'Consejos / Requisitos',
        card_tooltip_title: 'Consejos & Requisitos',
        campaign_tip_1: 'Para mejores resultados de masterización, envía archivos WAV o AIFF de alta calidad.',
        campaign_tip_2: 'Deja al menos -3dB de headroom en tu master bus para una masterización óptima.',
        campaign_tip_5: 'Las sesiones de feedback son más útiles cuando compartes tu intención artística y tracks de referencia.',
        campaign_tip_6: 'Los envíos a sellos funcionan mejor cuando tu perfil de artista está completo con bio y foto.',
        campaign_tip_7: 'Los tiempos de entrega pueden variar según la complejidad del proyecto y el paquete seleccionado.',
        campaign_tip_8: 'Nuestro equipo revisa cada envío con cuidado — la calidad es nuestra máxima prioridad.',
        dailypush_tip_1: '',
        dailypush_tip_2: '',
        dailypush_tip_3: '',
        top100_tooltip_title: '',
        top100_tip_1: '',
        top100_tip_2: '',
        top100_tip_3: '',
        top100_tip_4: '',
        top100_tip_5: '',
        top100_tip_6: '',
        top100_tip_7: '',
        top10_tooltip_title: '',
        top10_tip_1: '',
        top10_tip_2: '',
        top10_tip_3: '',
        top10_tip_4: '',
        top10_tip_footer_1: '',
        top10_tip_footer_daily_push: '',
        top10_tip_footer_2: '',
        top10_tip_footer_3: '',
        campaign_validate_genre: 'Por favor, confirma el género de tu track antes de enviar.',
        campaign_validate_artists: 'Por favor, ingresa al menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecciona una track antes de elegir un paquete.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paquete',
        campaign_summary_copies: 'copias',
        how_badge: 'NUESTRO PROCESO',
        how_title: 'Cómo funciona <span class="text-gradient">AlphaStudios</span>',
        how_step1_title: 'Encuentra tu track',
        how_step1_desc: 'Busca tu track usando nuestra barra de búsqueda y selecciónala.',
        how_step1_detail: 'Nuestro sistema identifica tu track y la prepara para el siguiente paso.',
        how_step2_title: 'Elige tu paquete',
        how_step2_desc: 'Selecciona el servicio que se adapte a tus necesidades:',
        how_step2_li1: 'Masterización profesional',
        how_step2_li2: 'Feedback & evaluación por expertos',
        how_step2_li3: 'Soporte de envío a sellos',
        how_step2_li4: 'Paquetes combinados',
        how_step2_detail: 'Cada paquete está diseñado para ayudar a tu música a alcanzar su máximo potencial.',
        how_step3_title: 'Procesamos tu pedido',
        how_step3_desc: 'Nuestro equipo se pone a trabajar en tu track.',
        how_step3_bullet1: 'AlphaStudios conecta tu música con ingenieros de masterización experimentados, profesionales de A&R y contactos de sellos construidos a lo largo de años en la industria.',
        how_step3_bullet2: 'Nuestro equipo trabaja en tu pedido y te mantiene informado del progreso.',
        how_step4_title: 'Recibe tus entregables',
        how_step4_desc: 'Una vez completado, recibes:',
        how_step4_li1: 'Archivos de audio masterizados',
        how_step4_li2: 'Informe de feedback detallado',
        how_step4_li3: 'Confirmación de envío al sello',
        how_step4_detail: 'Todos los entregables se envían directamente por email.',
        how_step5_title: 'Recibos proporcionados',
        how_step5_desc: 'Recibirás recibos y documentación de todos los servicios prestados.',
        why_badge: 'POR QUÉ ALPHASTUDIOS',
        why_title: 'Por qué elegir AlphaStudios para tu música',
        why_subtitle: 'Eleva tu sonido',
        why_card1_title: 'Calidad de estudio profesional',
        why_card1_text: 'Toda la masterización es realizada por ingenieros experimentados usando herramientas y técnicas estándar de la industria para asegurar que tu música suene lo mejor posible.',
        why_card2_title: 'Servicio profesional',
        why_card2_text: 'Cada pedido se maneja con cuidado y precisión. Nuestro equipo de ingenieros y profesionales de A&R aporta años de experiencia a cada proyecto.',
        why_card3_title: 'Entrega rápida',
        why_card3_text: 'Entendemos que el timing importa. Nuestro flujo de trabajo optimizado garantiza una entrega rápida sin comprometer la calidad.\n\nTodos los entregables vienen con documentación completa y soporte.',
        faq_title: 'Preguntas frecuentes',
        faq0a_q: '¿Qué pasa después de hacer mi pedido?',
        faq0a_a: 'Una vez realizado tu pedido, recibirás inmediatamente un email de confirmación.<br>El proceso es rápido, sencillo y totalmente gestionado por nuestro equipo.<br><br><strong>Esto es lo que sucede después:</strong><br><br>1. <strong>Verificación del track</strong> — Nuestro equipo revisa tu track y confirma que los archivos de audio están listos para el procesamiento.<br>2. <strong>Procesamiento</strong> — Nuestros ingenieros comienzan a trabajar en tu masterización, feedback o envío al sello según el paquete seleccionado.<br>3. <strong>Control de calidad</strong> — Cada entregable pasa por una revisión de calidad antes de ser enviado.<br>4. <strong>Entrega</strong> — Recibes tus archivos masterizados, informe de feedback o confirmación de envío al sello por email.<br>5. <strong>Notificación de finalización</strong> — Una vez que todo esté entregado, recibirás un email de confirmación final.<br><br>Eso es todo. Relájate y deja que nuestros profesionales se encarguen del resto.',
        faq0b_q: '¿Cuál es la política de reembolso?',
        faq0b_a: 'Trabajamos duro para garantizar que cada pedido se complete al más alto nivel.<br><br>Si tu pedido no puede ejecutarse o los entregables no pueden proporcionarse en el plazo anunciado, puedes solicitar:<br>• Un reembolso completo, o<br>• Un servicio de reemplazo<br><br>Contacta con nuestro equipo de soporte en cualquier momento.<br><br>Nuestro objetivo es siempre ofrecer un servicio transparente, fiable y profesional.',
        faq1_q: '¿Cuánto tiempo toma el procesamiento?',
        faq1_a: 'La mayoría de los pedidos se completan en 2 a 5 días hábiles, dependiendo del paquete y la carga de trabajo actual.',
        faq2_q: '¿Qué formatos entregan?',
        faq2_a: 'Entregamos tracks masterizados en WAV (24-bit) y MP3 (320kbps). Formatos personalizados están disponibles bajo demanda.',
        faq3_q: '¿Pueden los nuevos artistas usar el servicio?',
        faq3_a: 'Sí. Trabajamos con artistas independientes, sellos y distribuidores en todos los niveles.',
        faq4_q: '¿Ofrecen feedback sin masterización?',
        faq4_a: 'Sí, ofrecemos paquetes de feedback independientes donde nuestro equipo de A&R proporciona notas detalladas sobre el mix, arreglo y preparación para el mercado de tu track.',
        faq5_q: '¿Algún consejo / requisito?',
        cta_title: '¿Listo para elevar tu música?',
        cta_desc: 'Únete a cientos de artistas que usan AlphaStudios para llevar su sonido al siguiente nivel.',
        cta_btn: 'EMPEZAR AHORA',
        footer_desc: 'Masterización profesional, feedback & soporte de sellos para artistas.',
        footer_nav: 'Navegación',
        footer_boost: 'Empezar',
        footer_how: 'Cómo funciona',
        footer_copy: '&copy; 2026 AlphaStudios. Todos los derechos reservados.',
        footer_disclaimer: '',
        footer_terms: 'Términos de Uso',
        hero_feature_feedback: 'Feedback Profesional',
        hero_feature_mastering: 'Mastering de Estudio',
        genre_placeholder: 'Selecciona tu género',
        genre_search_placeholder: 'Buscar...',
        pricing_title_v2: 'Elige tu <span class="text-gradient">Plan</span>',
        pricing_desc_v2: 'Comienza con una prueba gratuita. Cancela cuando quieras.',
        pricing_pro_badge: 'PLAN PRO',
        pricing_pro_title: 'Plan Pro',
        pricing_pro_desc: 'Todo lo que necesitas para lanzar tu música profesionalmente.',
        pricing_free_trial: 'Prueba gratuita de 3 días',
        pricing_feat_1: 'Hasta 5 tracks por mes',
        pricing_feat_2: 'Feedback en profundidad de profesionales de la industria',
        pricing_feat_3: 'Masterización premium para un sonido listo para lanzamiento',
        pricing_feat_4: 'Acceso privado a WhatsApp con nuestro equipo de ingenieros',
        pricing_cta: 'Iniciar prueba gratuita',
        pricing_requirements_btn: 'Requisitos de envío',
        req_title: 'REQUISITOS',
        req_intro: 'Para garantizar los mejores resultados, sigue estas pautas antes de enviar tu track.',
        req_format_title: 'Formato de Audio',
        req_format_1: 'Solo WAV o AIFF',
        req_format_2: '24-bit preferido (16-bit mínimo)',
        req_format_3: 'Frecuencia de muestreo: 44.1 kHz o superior',
        req_headroom_title: 'Headroom',
        req_headroom_1: 'Deja -6 dB de headroom en tu master',
        req_headroom_2: 'Sin clipping',
        req_nolimit_title: 'Sin Limitador',
        req_nolimit_1: 'Elimina cualquier limitador del canal master',
        req_nolimit_2: 'Evita compresión excesiva en el master',
        req_export_title: 'Calidad de Exportación',
        req_export_1: 'Exporta tu mixdown final',
        req_export_2: 'Sin MP3 ni formatos comprimidos',
        req_mix_title: 'Balance del Mix',
        req_mix_1: 'Balance adecuado entre elementos',
        req_mix_2: 'Sin señales distorsionadas o sobre-saturadas',
        req_mix_3: 'Graves limpios (separación kick / bajo)',
        req_version_title: 'Versión',
        req_version_1: 'Envía solo la versión final',
        req_version_2: 'Sin borradores o ideas incompletas',
        req_optional_title: 'Género & Referencias',
        req_optional_1: 'Selecciona el género que mejor se adapte a tu track',
        req_optional_2: 'Artista de referencia (para ayudarnos a saber qué tipo de sonido usar como referencia)',
        how_desc: 'Simple. Claro. Efectivo.',
        how_step1_v2: 'Sube tu track',
        how_step1_desc_v2: 'Envíanos tu música y deja que nuestro equipo se encargue.',
        how_step2_v2: 'Recibe feedback profesional detallado',
        how_step2_desc_v2: 'Obtén consejos precisos y accionables de profesionales de la industria.',
        how_step3_v2: 'Refina tu track',
        how_step3_desc_v2: 'Re-sube tu track si quieres aplicar las mejoras y elevar tu sonido.',
        how_step4_v2: 'Masterización final',
        how_step4_desc_v2: 'Nuestro estudio entrega un master listo para lanzamiento, con los más altos estándares de la industria musical.',
        whatwedo_badge: 'LO QUE HACEMOS',
        whatwedo_title: 'Nuestros <span class="text-gradient">Servicios</span>',
        whatwedo_tagline: 'Cada track es tratada con tiempo, atención y precisión.<br><strong>Sin automatización. Sin atajos.</strong>',
        whatwedo_feedback_title: 'Feedback Profesional',
        whatwedo_feedback_desc: 'Tu música es evaluada por un comité de profesionales de la industria.',
        whatwedo_feedback_li1: 'Múltiples sesiones de escucha',
        whatwedo_feedback_li2: 'Análisis técnico + artístico',
        whatwedo_feedback_li3: 'Mejoras claras y accionables',
        whatwedo_feedback_li4: 'Feedback honesto y preciso',
        whatwedo_feedback_footer: 'Nuestro comité está compuesto por ingenieros, productores y líderes de la industria que trabajan — o han trabajado — con sellos y artistas de primer nivel.',
        whatwedo_mastering_title: 'Mastering de Estudio',
        whatwedo_mastering_desc: 'Una vez que tu track esté lista, nos encargamos del mastering final.',
        whatwedo_mastering_li1: 'Sonido estándar de la industria',
        whatwedo_mastering_li2: 'Resultado listo para clubs',
        whatwedo_mastering_li3: 'Optimizado para streaming',
        whatwedo_mastering_li4: 'Calidad de audio premium',
        whatwedo_mastering_footer: 'Tu música es masterizada por nuestro equipo, con experiencia en grandes sellos y artistas internacionales.',
        faq_badge: 'FAQ',
        faq1_q_v2: '¿Qué ofrecen exactamente?',
        faq1_a_v2: '<p>Ofrecemos dos servicios principales:</p><ul><li>Feedback profesional de un comité de expertos de la industria</li><li>Mastering premium realizado por nuestro equipo</li></ul><p>Nuestro objetivo es simple: elevar tu track a un estándar profesional, listo para el lanzamiento.</p>',
        faq2_q_v2: '¿Quién evalúa mi música?',
        faq2_a_v2: '<p>Tu track es evaluada por un comité de profesionales que incluye:</p><ul><li>Ingenieros de sonido</li><li>Productores</li><li>Tomadores de decisiones de la industria</li></ul><p>Todos los miembros tienen experiencia con sellos y artistas de primer nivel.</p>',
        faq3_q_v2: '¿El feedback es detallado?',
        faq3_a_v2: '<p>Proporcionamos feedback estructurado y accionable, no comentarios genéricos. Recibirás:</p><ul><li>Análisis técnico (mix, balance, estructura)</li><li>Dirección artística</li><li>Sugerencias de mejora precisas</li></ul><p>Cada track se escucha varias veces antes de entregar el feedback.</p>',
        faq4_q_v2: '¿Cuánto tiempo toma?',
        faq4_a_v2: '<p>El tiempo de procesamiento suele ser de 24 a 72 horas por track.</p><p>Se da prioridad a los usuarios Pro mensuales.</p>',
        faq5_q_v2: '¿Necesito enviar una track terminada?',
        faq5_a_v2: '<p>Sí. Solo trabajamos con versiones finales o casi finales.</p><p>El feedback está diseñado para refinar y elevar — no para construir una track desde cero.</p>',
        faq6_q_v2: '¿Qué pasa después de recibir el feedback?',
        faq6_a_v2: '<p>Puedes:</p><ol><li>Aplicar las mejoras sugeridas</li><li>Enviarnos tu versión actualizada</li><li>Procedemos con el mastering final</li></ol>',
        faq7_q_v2: '¿Puedo enviar una versión revisada?',
        faq7_a_v2: '<p>Sí. El proceso está diseñado para permitir un ciclo de mejora antes del mastering.</p>',
        faq8_q_v2: '¿Qué hace diferente su mastering?',
        faq8_a_v2: '<p>Nuestro mastering está diseñado para cumplir con los estándares profesionales de lanzamiento. Tu track será:</p><ul><li>Equilibrada en todos los sistemas de escucha</li><li>Competitiva en plataformas de streaming</li><li>Optimizada para clubs y ambientes de alto volumen</li></ul><p>Nos enfocamos en claridad, impacto y consistencia.</p>',
        faq9_q_v2: '¿Qué formato de archivo debo enviar?',
        faq9_a_v2: '<p>Por favor envía:</p><ul><li>WAV o AIFF</li><li>24-bit preferido</li><li>Sin limitador en el master</li><li>Mínimo -6 dB de headroom</li></ul><p>Los requisitos completos están listados arriba.</p>',
        faq10_q_v2: '¿Usan herramientas de IA?',
        faq10_a_v2: '<p>No. Todo el feedback y mastering son realizados por profesionales reales.</p>',
        faq11_q_v2: '¿Los principiantes pueden usar el servicio?',
        faq11_a_v2: '<p>Sí — pero tu track debe estar estructurada y correctamente producida.</p><p>Trabajamos mejor con productores que ya tienen una base sólida.</p>',
        footer_support: 'Soporte',
    },
    de: {
        page_title: 'AlphaStudios - Professionelles Mastering, Feedback & Label-Support für Künstler',
        page_desc: 'Professionelles Mastering, Experten-Feedback und Label-Einreichungsunterstützung. AlphaStudios hilft Künstlern, Musik auf höchstem Niveau zu veröffentlichen.',
        nav_how: 'WIE ES FUNKTIONIERT',
        nav_pricing: 'Preise',
        nav_cta: 'JETZT STARTEN',
        nav_login: 'Anmelden',
        nav_logout: 'Abmelden',
        nav_dashboard: 'Dashboard',
        auth_prompt_title: 'Anmelden um fortzufahren',
        auth_prompt_text: 'Bitte melden Sie sich mit Ihrem Google-Konto an, um mit Ihrer Kampagne fortzufahren.',
        auth_google_btn: 'Mit Google anmelden',
        auth_cancel: 'Abbrechen',
        dashboard_badge: 'DASHBOARD',
        dashboard_title: 'Studio Dashboard',
        dashboard_desc: 'Deine Tracks. Dein Fortschritt. Dein Sound.',
        dashboard_empty: 'Noch keine Tracks.',
        dashboard_status_completed: 'Abgeschlossen',
        dashboard_status_progress: 'In Bearbeitung',
        dashboard_label_campaign: 'Kampagne',
        dashboard_label_genre: 'Genre',
        dashboard_label_date: 'Datum',
        dashboard_label_similar: 'Ähnliche Künstler',
        dashboard_label_receipt: 'Beleg',
        dashboard_cta: 'Lade deinen ersten Track hoch',
        dashboard_error: 'Kampagnen konnten nicht geladen werden.',
        hero_badge: 'Hör auf, unfertige Demos zu schicken.',
        hero_title: 'Wir Machen Deinen Track <span class="text-gradient">Club</span> & <span class="text-gradient">Label</span> Ready',
        hero_subtitle: 'We help artists reach the highest standards.',
        hero_cta_btn: 'JETZT STARTEN',
        feature_no_bots: 'Detaillierte Feedback-Berichte',
        feature_scheduling: 'Professionelles Mastering',
        feature_strategy: 'Label-Einreichungsunterstützung',
        feature_guarantee: 'Demos an Labels',
        upload_badge: 'LADE DEINEN TRACK HOCH',
        upload_title: 'Lade deinen Track für <span class="text-green">Mastering</span> hoch',
        upload_desc: 'Ziehe deine Audiodatei hierher oder klicke zum Hochladen.',
        upload_tagline: 'Professionelle Qualität. Schnelle Lieferung. Ehrliches Feedback.',
        upload_drop_text: 'Ziehe deine Audiodatei hierher',
        upload_drop_hint: 'oder klicke zum Durchsuchen — Siehe Anforderungen',
        pricing_badge: 'PREISE',
        pricing_title: 'Wähle Dein <span class="text-green">Paket</span>',
        pricing_desc: 'Unsere Pakete werden von erfahrenen Ingenieuren und A&R-Profis entwickelt, um deiner Musik die besten Erfolgschancen zu geben.',
        choose_btn: 'Wählen',
        popular_badge: 'BELIEBT',
        change_track: 'Ändern',
        campaign_badge: 'AB IN DIE DETAILS',
        campaign_title: 'Bestellkonfiguration',
        campaign_desc: 'Konfiguriere deine Bestellung vor dem Absenden.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Bestätige das erkannte Genre deines Tracks.',
        campaign_genre_hint_manual: 'Bitte gib dein Genre unten ein.',
        campaign_genre_input_placeholder: 'Genre eingeben (z.B. Afro House, Melodic Techno...)',
        campaign_confirm: 'Bestätigen',
        campaign_confirmed: 'Bestätigt',
        campaign_artists_label: 'Ähnliche Künstler (Zur Referenz)',
        campaign_artists_hint: 'Gib 3 Künstler mit ähnlichem Stil wie dein Track ein — so können unsere Ingenieure deinen Sound verstehen und die richtigen Labels ansprechen.',
        campaign_artists_placeholder: 'Wähle einen ähnlichen Künstler',
        campaign_release_label: 'Veröffentlichungsstatus',
        campaign_release_hint: 'Ist dein Track bereits veröffentlicht oder in Vorbestellung?',
        campaign_released: 'Bereits veröffentlicht',
        campaign_preorder: 'Vorbestellung',
        campaign_launch_btn: 'Meine Bestellung aufgeben',
        payment_success: 'Zahlung bestätigt!',
        payment_success_sub: 'Ihre Bestellung wird bearbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.\nSie erhalten Ihre Lieferungen innerhalb des in Ihrem Paket angegebenen Zeitrahmens.',
        payment_success_whatsapp_text: 'Wenn Sie über Ihren Track sprechen, eine Frage stellen oder einfach über Ihre Bestellung auf dem Laufenden bleiben möchten, zögern Sie nicht, uns zu kontaktieren.',
        payment_success_whatsapp_btn: 'Chatten Sie mit uns',
        campaign_tips_title: 'Tipps / Anforderungen',
        card_tooltip_title: 'Tipps & Anforderungen',
        campaign_tip_1: 'Für beste Mastering-Ergebnisse, reiche hochwertige WAV- oder AIFF-Dateien ein.',
        campaign_tip_2: 'Lasse mindestens -3dB Headroom auf deinem Master-Bus für optimales Mastering.',
        campaign_tip_5: 'Feedback-Sitzungen sind am nützlichsten, wenn du deine künstlerische Absicht und Referenztracks teilst.',
        campaign_tip_6: 'Label-Einreichungen funktionieren besser, wenn dein Künstlerprofil mit Bio und Foto vollständig ist.',
        campaign_tip_7: 'Lieferzeiten können je nach Komplexität des Projekts und gewähltem Paket variieren.',
        campaign_tip_8: 'Unser Team überprüft jede Einreichung sorgfältig — Qualität ist unsere oberste Priorität.',
        dailypush_tip_1: '',
        dailypush_tip_2: '',
        dailypush_tip_3: '',
        top100_tooltip_title: '',
        top100_tip_1: '',
        top100_tip_2: '',
        top100_tip_3: '',
        top100_tip_4: '',
        top100_tip_5: '',
        top100_tip_6: '',
        top100_tip_7: '',
        top10_tooltip_title: '',
        top10_tip_1: '',
        top10_tip_2: '',
        top10_tip_3: '',
        top10_tip_4: '',
        top10_tip_footer_1: '',
        top10_tip_footer_daily_push: '',
        top10_tip_footer_2: '',
        top10_tip_footer_3: '',
        campaign_validate_genre: 'Bitte bestätige das Genre deines Tracks vor dem Absenden.',
        campaign_validate_artists: 'Bitte gib mindestens 1 ähnlichen Künstler ein.',
        choose_validate_track: 'Bitte wähle zuerst einen Track aus, bevor du ein Paket wählst.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paket',
        campaign_summary_copies: 'Kopien',
        how_badge: 'UNSER PROZESS',
        how_title: 'Wie AlphaStudios <span class="text-gradient">funktioniert</span>',
        how_step1_title: 'Finde deinen Track',
        how_step1_desc: 'Suche deinen Track über unsere Suchleiste und wähle ihn aus.',
        how_step1_detail: 'Unser System identifiziert deinen Track und bereitet ihn für den nächsten Schritt vor.',
        how_step2_title: 'Wähle dein Paket',
        how_step2_desc: 'Wähle den Service, der zu deinen Bedürfnissen passt:',
        how_step2_li1: 'Professionelles Mastering',
        how_step2_li2: 'Experten-Feedback & Bewertung',
        how_step2_li3: 'Label-Einreichungsunterstützung',
        how_step2_li4: 'Kombinierte Pakete',
        how_step2_detail: 'Jedes Paket ist darauf ausgelegt, deiner Musik zu helfen, ihr volles Potenzial zu erreichen.',
        how_step3_title: 'Wir bearbeiten deine Bestellung',
        how_step3_desc: 'Unser Team beginnt mit der Arbeit an deinem Track.',
        how_step3_bullet1: 'AlphaStudios verbindet deine Musik mit erfahrenen Mastering-Ingenieuren, A&R-Profis und Label-Kontakten, die über Jahre in der Branche aufgebaut wurden.',
        how_step3_bullet2: 'Unser Team arbeitet an deiner Bestellung und hält dich über den Fortschritt auf dem Laufenden.',
        how_step4_title: 'Erhalte deine Lieferungen',
        how_step4_desc: 'Nach Abschluss erhältst du:',
        how_step4_li1: 'Gemasterte Audiodateien',
        how_step4_li2: 'Detaillierter Feedback-Bericht',
        how_step4_li3: 'Label-Einreichungsbestätigung',
        how_step4_detail: 'Alle Lieferungen werden direkt per E-Mail gesendet.',
        how_step5_title: 'Belege bereitgestellt',
        how_step5_desc: 'Sie erhalten Belege und Dokumentation für alle erbrachten Leistungen.',
        why_badge: 'WARUM ALPHASTUDIOS',
        why_title: 'Warum AlphaStudios für deine Musik wählen',
        why_subtitle: 'Hebe deinen Sound an',
        why_card1_title: 'Professionelle Studioqualität',
        why_card1_text: 'Alles Mastering wird von erfahrenen Ingenieuren mit branchenüblichen Werkzeugen und Techniken durchgeführt, um sicherzustellen, dass deine Musik bestmöglich klingt.',
        why_card2_title: 'Professioneller Service',
        why_card2_text: 'Jede Bestellung wird mit Sorgfalt und Präzision behandelt. Unser Team aus Ingenieuren und A&R-Profis bringt jahrelange Erfahrung in jedes Projekt ein.',
        why_card3_title: 'Schnelle Lieferung',
        why_card3_text: 'Wir verstehen, dass Timing wichtig ist. Unser optimierter Workflow sorgt für schnelle Lieferung ohne Kompromisse bei der Qualität.\n\nAlle Lieferungen kommen mit vollständiger Dokumentation und Support.',
        faq_title: 'Häufig gestellte Fragen',
        faq0a_q: 'Was passiert nach meiner Bestellung?',
        faq0a_a: 'Sobald Ihre Bestellung aufgegeben wurde, erhalten Sie sofort eine Bestätigungs-E-Mail.<br>Der Prozess ist schnell, einfach und wird vollständig von unserem Team abgewickelt.<br><br><strong>Das passiert als Nächstes:</strong><br><br>1. <strong>Track-Verifizierung</strong> — Unser Team überprüft Ihren Track und bestätigt, dass die Audiodateien für die Bearbeitung bereit sind.<br>2. <strong>Bearbeitung</strong> — Unsere Ingenieure beginnen mit der Arbeit an Ihrem Mastering, Feedback oder Ihrer Label-Einreichung gemäß dem gewählten Paket.<br>3. <strong>Qualitätskontrolle</strong> — Jede Lieferung durchläuft eine Qualitätsprüfung, bevor sie an Sie gesendet wird.<br>4. <strong>Lieferung</strong> — Sie erhalten Ihre gemasterten Dateien, Feedback-Bericht oder Label-Einreichungsbestätigung per E-Mail.<br>5. <strong>Abschlussbenachrichtigung</strong> — Sobald alles geliefert ist, erhalten Sie eine abschließende Bestätigungs-E-Mail.<br><br>Das war\'s. Lehnen Sie sich zurück und lassen Sie unsere Profis den Rest erledigen.',
        faq0b_q: 'Wie lautet die Rückerstattungsrichtlinie?',
        faq0b_a: 'Wir arbeiten hart daran, dass jede Bestellung auf höchstem Niveau abgeschlossen wird.<br><br>Wenn Ihre Bestellung nicht ausgeführt werden kann oder die Lieferungen nicht im angekündigten Zeitrahmen bereitgestellt werden können, können Sie Folgendes anfordern:<br>• Eine vollständige Rückerstattung, oder<br>• Einen Ersatzservice<br><br>Kontaktieren Sie jederzeit unser Support-Team bei Fragen.<br><br>Unser Ziel ist es immer, einen transparenten, zuverlässigen und professionellen Service zu bieten.',
        faq1_q: 'Wie lange dauert die Bearbeitung?',
        faq1_a: 'Die meisten Bestellungen werden innerhalb von 2 bis 5 Werktagen abgeschlossen, je nach Paket und aktueller Auslastung.',
        faq2_q: 'Welche Formate liefern Sie?',
        faq2_a: 'Wir liefern gemasterte Tracks in WAV (24-Bit) und MP3 (320kbps). Kundenspezifische Formate sind auf Anfrage verfügbar.',
        faq3_q: 'Können neue Künstler den Service nutzen?',
        faq3_a: 'Ja. Wir arbeiten mit unabhängigen Künstlern, Labels und Distributoren auf jedem Niveau.',
        faq4_q: 'Bieten Sie Feedback ohne Mastering an?',
        faq4_a: 'Ja, wir bieten eigenständige Feedback-Pakete an, bei denen unser A&R-Team detaillierte Anmerkungen zu Mix, Arrangement und Marktreife Ihres Tracks liefert.',
        faq5_q: 'Tipps / Anforderungen?',
        cta_title: 'Bereit, deine Musik auf das nächste Level zu bringen?',
        cta_desc: 'Schließe dich Hunderten von Künstlern an, die AlphaStudios nutzen, um ihren Sound auf das nächste Level zu bringen.',
        cta_btn: 'JETZT STARTEN',
        footer_desc: 'Professionelles Mastering, Feedback & Label-Support für Künstler.',
        footer_nav: 'Navigation',
        footer_boost: 'Jetzt starten',
        footer_how: 'Wie es funktioniert',
        footer_copy: '&copy; 2026 AlphaStudios. Alle Rechte vorbehalten.',
        footer_disclaimer: '',
        footer_terms: 'Nutzungsbedingungen',
        hero_feature_feedback: 'Professionelles Feedback',
        hero_feature_mastering: 'Studio-Mastering',
        genre_placeholder: 'Wähle dein Genre',
        genre_search_placeholder: 'Suchen...',
        pricing_title_v2: 'Wähle deinen <span class="text-gradient">Plan</span>',
        pricing_desc_v2: 'Starte mit einer kostenlosen Testphase. Jederzeit kündbar.',
        pricing_pro_badge: 'PRO PLAN',
        pricing_pro_title: 'Pro Plan',
        pricing_pro_desc: 'Alles was du brauchst, um deine Musik professionell zu veröffentlichen.',
        pricing_free_trial: '3 Tage kostenlos testen',
        pricing_feat_1: 'Bis zu 5 Tracks pro Monat',
        pricing_feat_2: 'Tiefgehendes Feedback von Branchenprofis',
        pricing_feat_3: 'Premium-Mastering für einen veröffentlichungsfertigen Sound',
        pricing_feat_4: 'Privater WhatsApp-Zugang zu unserem Ingenieurteam',
        pricing_cta: 'Kostenlos testen',
        pricing_requirements_btn: 'Einreichungsvoraussetzungen',
        req_title: 'VORAUSSETZUNGEN',
        req_intro: 'Um die besten Ergebnisse zu gewährleisten, befolge bitte diese Richtlinien vor dem Einreichen deines Tracks.',
        req_format_title: 'Audioformat',
        req_format_1: 'Nur WAV oder AIFF',
        req_format_2: '24-Bit bevorzugt (16-Bit Minimum)',
        req_format_3: 'Abtastrate: 44.1 kHz oder höher',
        req_headroom_title: 'Headroom',
        req_headroom_1: '-6 dB Headroom auf dem Master lassen',
        req_headroom_2: 'Kein Clipping',
        req_nolimit_title: 'Kein Limiter',
        req_nolimit_1: 'Entferne jeden Limiter vom Master-Kanal',
        req_nolimit_2: 'Vermeide starke Kompression auf dem Master',
        req_export_title: 'Exportqualität',
        req_export_1: 'Exportiere deinen finalen Mixdown',
        req_export_2: 'Kein MP3 oder komprimierte Formate',
        req_mix_title: 'Mix-Balance',
        req_mix_1: 'Ausgewogene Balance zwischen Elementen',
        req_mix_2: 'Keine verzerrten oder übersättigten Signale',
        req_mix_3: 'Sauberer Bass (Kick / Bass Trennung)',
        req_version_title: 'Version',
        req_version_1: 'Nur die finale Version einreichen',
        req_version_2: 'Keine Entwürfe oder unfertige Ideen',
        req_optional_title: 'Genre & Referenzen',
        req_optional_1: 'Wähle das Genre, das am besten zu deinem Track passt',
        req_optional_2: 'Referenzkünstler (um uns zu helfen, welchen Sound wir als Referenz verwenden sollen)',
        how_desc: 'Einfach. Klar. Effektiv.',
        how_step1_v2: 'Lade deinen Track hoch',
        how_step1_desc_v2: 'Schick uns deine Musik und lass unser Team übernehmen.',
        how_step2_v2: 'Erhalte detailliertes professionelles Feedback',
        how_step2_desc_v2: 'Erhalte präzise, umsetzbare Einblicke von Branchenprofis.',
        how_step3_v2: 'Verfeinere deinen Track',
        how_step3_desc_v2: 'Lade deinen Track erneut hoch, wenn du die Verbesserungen anwenden und deinen Sound verbessern möchtest.',
        how_step4_v2: 'Finales Mastering',
        how_step4_desc_v2: 'Unser Studio liefert einen veröffentlichungsfertigen Master nach den höchsten Standards der Musikindustrie.',
        whatwedo_badge: 'WAS WIR TUN',
        whatwedo_title: 'Unsere <span class="text-gradient">Dienste</span>',
        whatwedo_tagline: 'Jeder Track wird mit Zeit, Aufmerksamkeit und Präzision behandelt.<br><strong>Keine Automatisierung. Keine Abkürzungen.</strong>',
        whatwedo_feedback_title: 'Professionelles Feedback',
        whatwedo_feedback_desc: 'Deine Musik wird von einem Komitee aus Branchenprofis bewertet.',
        whatwedo_feedback_li1: 'Mehrere Hörsitzungen',
        whatwedo_feedback_li2: 'Technische + künstlerische Analyse',
        whatwedo_feedback_li3: 'Klare, umsetzbare Verbesserungen',
        whatwedo_feedback_li4: 'Ehrliches, präzises Feedback',
        whatwedo_feedback_footer: 'Unser Komitee besteht aus Ingenieuren, Produzenten und Branchenführern, die mit Top-Labels und Künstlern arbeiten — oder gearbeitet haben.',
        whatwedo_mastering_title: 'Studio-Mastering',
        whatwedo_mastering_desc: 'Sobald dein Track fertig ist, übernehmen wir das finale Mastering.',
        whatwedo_mastering_li1: 'Branchenstandard-Sound',
        whatwedo_mastering_li2: 'Club-fertiges Ergebnis',
        whatwedo_mastering_li3: 'Streaming-optimiert',
        whatwedo_mastering_li4: 'Premium-Audioqualität',
        whatwedo_mastering_footer: 'Deine Musik wird von unserem Team gemastert, mit Erfahrung bei großen Labels und internationalen Künstlern.',
        faq_badge: 'FAQ',
        faq1_q_v2: 'Was genau bieten Sie an?',
        faq1_a_v2: '<p>Wir bieten zwei Kerndienstleistungen:</p><ul><li>Professionelles Feedback von einem Komitee aus Branchenexperten</li><li>Premium-Mastering durch unser Team</li></ul><p>Unser Ziel ist einfach: Deinen Track auf einen professionellen, veröffentlichungsfertigen Standard zu bringen.</p>',
        faq2_q_v2: 'Wer bewertet meine Musik?',
        faq2_a_v2: '<p>Dein Track wird von einem Komitee aus Fachleuten bewertet, darunter:</p><ul><li>Toningenieure</li><li>Produzenten</li><li>Branchenentscheider</li></ul><p>Alle Mitglieder haben Erfahrung mit Top-Labels und Künstlern.</p>',
        faq3_q_v2: 'Wie detailliert ist das Feedback?',
        faq3_a_v2: '<p>Wir bieten strukturiertes, umsetzbares Feedback, keine generischen Kommentare. Du erhältst:</p><ul><li>Technische Analyse (Mix, Balance, Struktur)</li><li>Künstlerische Richtung</li><li>Präzise Verbesserungsvorschläge</li></ul><p>Jeder Track wird mehrmals angehört, bevor das Feedback geliefert wird.</p>',
        faq4_q_v2: 'Wie lange dauert es?',
        faq4_a_v2: '<p>Die Bearbeitungszeit liegt typischerweise zwischen 24 und 72 Stunden pro Track.</p><p>Pro-Nutzer erhalten Priorität.</p>',
        faq5_q_v2: 'Muss ich einen fertigen Track einreichen?',
        faq5_a_v2: '<p>Ja. Wir arbeiten nur mit finalen oder nahezu finalen Versionen.</p><p>Das Feedback ist darauf ausgelegt zu verfeinern und zu verbessern — nicht einen Track von Grund auf zu erstellen.</p>',
        faq6_q_v2: 'Was passiert nach Erhalt des Feedbacks?',
        faq6_a_v2: '<p>Du kannst:</p><ol><li>Die vorgeschlagenen Verbesserungen anwenden</li><li>Uns deine aktualisierte Version schicken</li><li>Wir fahren mit dem finalen Mastering fort</li></ol>',
        faq7_q_v2: 'Kann ich eine überarbeitete Version einreichen?',
        faq7_a_v2: '<p>Ja. Der Prozess ist so konzipiert, dass ein Verbesserungszyklus vor dem Mastering möglich ist.</p>',
        faq8_q_v2: 'Was macht Ihr Mastering besonders?',
        faq8_a_v2: '<p>Unser Mastering ist darauf ausgelegt, professionelle Veröffentlichungsstandards zu erfüllen. Dein Track wird:</p><ul><li>Auf allen Wiedergabesystemen ausgewogen sein</li><li>Auf Streaming-Plattformen wettbewerbsfähig sein</li><li>Für Clubs und Umgebungen mit hoher Lautstärke optimiert sein</li></ul><p>Wir konzentrieren uns auf Klarheit, Wirkung und Konsistenz.</p>',
        faq9_q_v2: 'Welches Dateiformat soll ich senden?',
        faq9_a_v2: '<p>Bitte sende:</p><ul><li>WAV oder AIFF</li><li>24-Bit bevorzugt</li><li>Kein Limiter auf dem Master</li><li>Mindestens -6 dB Headroom</li></ul><p>Die vollständigen Anforderungen sind oben aufgeführt.</p>',
        faq10_q_v2: 'Verwenden Sie KI-Tools?',
        faq10_a_v2: '<p>Nein. Alles Feedback und Mastering wird von echten Profis durchgeführt.</p>',
        faq11_q_v2: 'Können Anfänger den Service nutzen?',
        faq11_a_v2: '<p>Ja — aber dein Track muss strukturiert und ordentlich produziert sein.</p><p>Wir arbeiten am besten mit Produzenten, die bereits eine solide Grundlage haben.</p>',
        footer_support: 'Support',
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
        window.dispatchEvent(new CustomEvent('alphastudios-langchange', { detail: { lang } }));
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

    // 3 colors only: black, white, one random accent
    const hue = Math.random() * 360;

    // Base: solid black
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    // Main color glow — large radial, random position
    const gx = size * (0.25 + Math.random() * 0.5);
    const gy = size * (0.25 + Math.random() * 0.5);
    const glow1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, size * 0.7);
    glow1.addColorStop(0, `hsl(${hue}, 70%, 55%)`);
    glow1.addColorStop(0.4, `hsla(${hue}, 65%, 40%, 0.7)`);
    glow1.addColorStop(0.7, `hsla(${hue}, 60%, 20%, 0.3)`);
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, size, size);

    // White glow — opposite corner
    const wx = size - gx + (Math.random() - 0.5) * size * 0.2;
    const wy = size - gy + (Math.random() - 0.5) * size * 0.2;
    const glow2 = ctx.createRadialGradient(wx, wy, 0, wx, wy, size * 0.55);
    glow2.addColorStop(0, 'rgba(255,255,255,0.7)');
    glow2.addColorStop(0.3, 'rgba(255,255,255,0.3)');
    glow2.addColorStop(0.6, 'rgba(255,255,255,0.05)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, size, size);

    // Subtle secondary color glow for richness
    const g2x = size * (0.1 + Math.random() * 0.8);
    const g2y = size * (0.1 + Math.random() * 0.8);
    const glow3 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, size * 0.4);
    glow3.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.4)`);
    glow3.addColorStop(0.5, `hsla(${hue}, 60%, 35%, 0.15)`);
    glow3.addColorStop(1, 'transparent');
    ctx.fillStyle = glow3;
    ctx.fillRect(0, 0, size, size);

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
            // Limit to 1 artist
            selectedArtists = [{ name, img }];
            renderArtistTags();
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

    // Hide searchbar when artist selected, show when removed
    const artistWrapper = document.querySelector('.artist-search-wrapper');
    if (artistWrapper) {
        artistWrapper.style.display = selectedArtists.length > 0 ? 'none' : '';
    }

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

    // Hide inline campaign form
    const inlineForm = document.getElementById('inlineCampaignForm');
    if (inlineForm) inlineForm.style.display = 'none';

    // Reset pricing buttons
    document.querySelectorAll('.pricing-plan-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
        btn.textContent = 'Start 3-Day Trial';
    });
    const banner = document.getElementById('selectedTrackBanner');
    if (banner) banner.remove();
}

function showUploadCountdown() {
    const dropzone = document.getElementById('uploadDropzone');
    if (!dropzone) return { cancel: () => {} };

    const originalContent = dropzone.innerHTML;

    // Build number spans (10 → 0) and message spans — all CSS animated, ZERO JS
    const nums = [];
    for (let i = 10; i >= 1; i--) nums.push(`<span class="cd-n" style="animation-delay:${(10 - i)}s">${i}</span>`);

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
            <img class="cd-icon" src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773648385/Black_and_Red_Modern_Initials_A_E-Sport_Gaming_Pictorial_Mark_Logo_hx5o3z.png" alt="" width="40" height="40">
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
            .cd-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px 0;animation:cd-in .35s ease;width:100%;height:100%;min-height:inherit;box-sizing:border-box}
            .cd-icon{width:40px;height:40px;border-radius:50%;object-fit:cover;animation:cd-spin 3s linear infinite}

            .cd-nums{position:relative;height:1.8rem;width:3rem;text-align:center;animation:cd-nums-hide 0.3s ease 10s forwards}
            @keyframes cd-nums-hide{to{height:0;margin:0;overflow:hidden}}
            .cd-n{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;color:var(--green-primary,#1a1a2e);font-variant-numeric:tabular-nums;opacity:0;animation:cd-show 1s steps(1) forwards}
            .cd-n:first-child{opacity:1}

            .cd-msgs{position:relative;height:1.4em;width:100%;text-align:center;white-space:nowrap}
            .cd-m{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:500;color:var(--text-secondary,#888);letter-spacing:.3px;opacity:0;animation:cd-msg-show 2s ease forwards}
            .cd-m:first-child{opacity:1}
            .cd-m:last-child{animation:cd-msg-show-last 2s ease forwards}

            .cd-dots{display:flex;gap:5px}
            .cd-dots span{width:6px;height:6px;border-radius:50%;background:var(--green-primary,#1a1a2e);opacity:.25;animation:cd-bounce 1.4s ease-in-out infinite}
            .cd-dots span:nth-child(2){animation-delay:.2s}
            .cd-dots span:nth-child(3){animation-delay:.4s}

            @keyframes cd-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
            @keyframes cd-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            @keyframes cd-bounce{0%,80%,100%{opacity:.25;transform:scale(1)}40%{opacity:1;transform:scale(1.3)}}
            @keyframes cd-show{0%{opacity:0}0.1%{opacity:1}99.9%{opacity:1}100%{opacity:0}}
            @keyframes cd-show-last{0%{opacity:0}0.1%{opacity:1}100%{opacity:1}}
            @keyframes cd-msg-show{0%{opacity:0}10%{opacity:1}85%{opacity:1}100%{opacity:0}}
            @keyframes cd-msg-show-last{0%{opacity:0}10%{opacity:1}100%{opacity:1}}
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

        // Mark that a track has been uploaded
        document.querySelectorAll('.pricing-plan-btn').forEach(btn => {
            btn.dataset.trackUploaded = 'true';
        });

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
        tags.push(`<span class="meta-tag meta-tag-accent">${Math.round(data.bpm)} BPM</span>`);
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
        const adjustedLoudness = data.loudness + 10;
        tags.push(`<span class="meta-tag">${adjustedLoudness.toFixed(1)} dB loudness</span>`);
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

// ===== Plan Config =====
const PLAN_LIMITS = { access: 1, pro: 5, elite: 10 };
const PLAN_NAMES = { access: 'Studio Access', pro: 'Studio Pro', elite: 'Studio Elite' };

function getTrackLimit(profile) {
    const plan = profile?.plan_type || 'pro';
    return PLAN_LIMITS[plan] || 5;
}

// ===== Package Selection =====
// Pricing plan buttons — redirect to Stripe checkout with trial
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.pricing-plan-btn');
    if (!btn) return;
    e.preventDefault();

    const plan = btn.dataset.plan || 'pro';

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
            body: JSON.stringify({ user_id: user?.id || '', user_email: user?.email || '', plan }),
        });
        const checkoutData = await checkoutRes.json();
        if (checkoutData.url) {
            window.location.href = checkoutData.url;
        } else {
            showToast('Failed to start subscription. Please try again.');
            btn.disabled = false;
            btn.style.opacity = '';
            btn.textContent = 'Start 3-Day Trial';
        }
    } catch (err) {
        console.error('[AlphaStudios] Checkout error:', err);
        showToast('Failed to start subscription. Please try again.');
        btn.disabled = false;
        btn.style.opacity = '';
        btn.textContent = 'Start 3-Day Trial';
    }
});

// Genre dropdown selector
const GENRE_LIST = [
    'Acid', 'Acid House', 'Afro House', 'Amapiano',
    'Bass Club', 'Bass House', 'Breaks Breakbeat Uk Bass',
    'Dance Electro Pop', 'Deep House', 'Disco',
    'Drum And Bass', 'Dubstep', 'Electro Classic Detroit Modern', 'Electronica',
    'Funky House', 'Ghetto House', 'Hard Dance Hardcore', 'Hard Techno', 'House',
    'Indie Dance', 'Jackin House', 'Latin House', 'Melodic House And Techno',
    'Minimal', 'Minimal Deep Tech', 'Minimal Techno',
    'Nu Disco', 'Organise House Downtempo', 'Progressive House',
    'Tech House', 'Tech House Latin', 'Tech House Rolling', 'Tech House Trippy',
    'Techno', 'Techno Peak Time Driving', 'Techno Raw Deep Hynotic',
    'Trance', 'Trance Main Floor', 'Trance Raw Deep Hynotic',
    'Uk Garage Bassline'
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

// Close requirements tooltips when clicking outside
document.addEventListener('click', function(e) {
    document.querySelectorAll('.requirements-tooltip-wrapper.active').forEach(wrapper => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('active');
        }
    });
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
        // User is subscribed — check track limit based on plan
        const tracksUsed = profile.tracks_used_this_month || 0;
        const tracksLimit = subStatus === 'trialing' ? 1 : getTrackLimit(profile);

        // Trial user at limit → redirect to paid checkout (no trial)
        if (subStatus === 'trialing' && tracksUsed >= tracksLimit) {
            localStorage.setItem('alphastudios_pending_campaign', JSON.stringify(campaignData));
            setBtnLoading('Redirecting...');
            try {
                const plan = profile.plan_type || 'pro';
                const checkoutRes = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.id, user_email: user.email, skip_trial: true, plan }),
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

            // Redirect to dashboard with submitted flag for success popup
            window.location.href = '/dashboard?submitted=' + encodeURIComponent(campaignData.track_title || 'Your track');
        } catch (err) {
            console.error('[AlphaStudios] Submit error:', err);
            showToast('Failed to submit track. Please try again.');
            resetBtn();
        }
    } else {
        // No subscription — save campaign data, scroll to pricing section
        localStorage.setItem('alphastudios_pending_campaign', JSON.stringify(campaignData));
        resetBtn();

        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                <img src="https://res.cloudinary.com/dymdijw7n/image/upload/v1773690586/Dark_Blue_Minimalist_Letter_A_Logo_rufnct.png" alt="AlphaStudios" class="toast-logo">
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
            <p class="confirm-subtitle">Your order has been confirmed. Our team will begin processing your track shortly. The average delivery time is 24–48 hours. You can track your order status anytime from your dashboard, where you will also receive the receipt and proof of delivery once the track is completed. Thank you for your trust.</p>

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
