/* src/lib/astrologyEngine.ts */

export interface PlanetaryPosition {
  name: string;
  deg: string;
  house: string;
  sign: string;
  element: string;
  aspect: string;
}

export interface AstrologyReportNarrative {
  sunSign: string;
  sunIntro: string;
  sunDetails: string;
  moonSign: string;
  moonIntro: string;
  moonDetails: string;
  risingSign: string;
  risingIntro: string;
  risingDetails: string;
  
  personalityOverview: string;
  strengths: string[];
  blindSpots: string[];
  
  communicationStyle: string;
  careerWealth: string;
  relationships: string;
  lifePurpose: string;
  
  planetaryHighlights: string;
  cosmicAdvice: string;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_ELEMENTS: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water"
};

// Deterministic calculations based on birth date parameters
export function calculateNatalParameters(month: number, day: number, hour: number, minute: number): {
  sun: string;
  moon: string;
  rising: string;
  positions: PlanetaryPosition[];
} {
  // 1-based month index (1 to 12)
  // Simple deterministic but realistic feeling astrology resolver
  const sunSignIndex = (month - 1 + (day > 21 ? 1 : 0)) % 12;
  const sunSign = ZODIAC_SIGNS[sunSignIndex];

  const moonSignIndex = (day + month) % 12;
  const moonSign = ZODIAC_SIGNS[moonSignIndex];

  const risingSignIndex = (sunSignIndex + Math.floor(hour / 2)) % 12;
  const risingSign = ZODIAC_SIGNS[risingSignIndex];

  const positions: PlanetaryPosition[] = [
    {
      name: "Sun",
      deg: `${(day * 13) % 30}° ${minute}'`,
      house: `${((hour + 4) % 12) + 1}st House`,
      sign: sunSign,
      element: SIGN_ELEMENTS[sunSign],
      aspect: "Conjunction to Mercury"
    },
    {
      name: "Moon",
      deg: `${(month * 7 + day) % 30}° 15'`,
      house: `${((hour + 1) % 12) + 1}th House`,
      sign: moonSign,
      element: SIGN_ELEMENTS[moonSign],
      aspect: "Trine to Neptune"
    },
    {
      name: "Ascendant (Rising)",
      deg: `${(minute * 3) % 30}° 45'`,
      house: "1st House cusp",
      sign: risingSign,
      element: SIGN_ELEMENTS[risingSign],
      aspect: "Square to Saturn"
    },
    {
      name: "Mercury",
      deg: `${(day * 4) % 30}° 09'`,
      house: `${((hour + 3) % 12) + 1}rd House`,
      sign: ZODIAC_SIGNS[(sunSignIndex + 1) % 12],
      element: SIGN_ELEMENTS[ZODIAC_SIGNS[(sunSignIndex + 1) % 12]],
      aspect: "Conjunction to Sun"
    },
    {
      name: "Venus",
      deg: `${(day * 9 + 4) % 30}° 42'`,
      house: `${((hour + 2) % 12) + 1}th House`,
      sign: ZODIAC_SIGNS[(sunSignIndex + 11) % 12],
      element: SIGN_ELEMENTS[ZODIAC_SIGNS[(sunSignIndex + 11) % 12]],
      aspect: "Sextile to Mars"
    },
    {
      name: "Mars",
      deg: `${(hour * 4 + 7) % 30}° 31'`,
      house: `${((hour + 9) % 12) + 1}th House`,
      sign: ZODIAC_SIGNS[(sunSignIndex + 4) % 12],
      element: SIGN_ELEMENTS[ZODIAC_SIGNS[(sunSignIndex + 4) % 12]],
      aspect: "Sextile to Venus"
    },
    {
      name: "Jupiter",
      deg: `${(month * 3 + 12) % 30}° 50'`,
      house: "5th House",
      sign: ZODIAC_SIGNS[(month + 2) % 12],
      element: SIGN_ELEMENTS[ZODIAC_SIGNS[(month + 2) % 12]],
      aspect: "Opposite to Saturn"
    },
    {
      name: "Saturn",
      deg: `${(day + month * 2) % 30}° 04'`,
      house: "7th House",
      sign: ZODIAC_SIGNS[(month + 6) % 12],
      element: SIGN_ELEMENTS[ZODIAC_SIGNS[(month + 6) % 12]],
      aspect: "Opposite to Jupiter"
    }
  ];

  return { sun: sunSign, moon: moonSign, rising: risingSign, positions };
}

// Astronomy database matching standard zodiac alignments to detailed, high-worth readings
const SUN_INTERPRETATIONS: Record<string, { intro: string; details: string }> = {
  Aries: {
    intro: "Your core identity blazes with raw fire, pioneering courage, and individual initiative.",
    details: "As an Aries Sun, your life force is inherently active and pioneering. You are designed to ignite new beginnings, initiate action, and lead with an uncompromising sense of independence. You do not wait for circumstances to align; rather, you force them into existence through sheer willpower. Operating under the influence of Mars, your path is one of the spiritual warrior—discovering your strength by overcoming obstacles."
  },
  Taurus: {
    intro: "Your core identity radiates grounded strength, sensory richness, and enduring determination.",
    details: "As a Taurus Sun, you are anchored by the soothing, fruitful energy of Venus. You excel at nurturing tangible resources, cultivating lasting value, and appreciating the deep beauty of physical existence. Your developmental path is one of patience, deliberate growth, and absolute loyalty. Your superpower is stability; you act as a bedrock of security in a chaotic and fast-paced world."
  },
  Gemini: {
    intro: "Your core identity dances with curiosity, fluid mental dexterity, and expressive intellect.",
    details: "Under the Mercurial winds of Gemini, your life is an eternal exploration of connection and concepts. You possess an insatiable hunger for variety, synthesizing complex ideas, and transmitting knowledge. Your energy is dynamic, youthful, and infinitely adaptable. You thrive at intersections, constantly bridging different domains, cultures, and groups through wit and communication."
  },
  Cancer: {
    intro: "Your core identity flows with emotional wisdom, profound intuition, and protective devotion.",
    details: "As a Cancer Sun, ruled by the changing tides of the Moon, your heart represents the temple of your existence. You possess an unparalleled emotional intelligence and deep connection to ancestral, family, and domestic spaces. Your path involves developing healthy boundaries while retaining your exquisite capacity to nurture, protect, and build emotional sanctuaries of safety."
  },
  Leo: {
    intro: "Your core identity shines with creative sovereignty, solar warmth, and heart-centered leadership.",
    details: "As a Leo Sun, your spirit is fueled by the central star of our solar system. You are meant to create from the heart, radiate joy, and command respect through elegant generosity. Your journey is about cultivating authentic self-worth, stepping onto the stage of your life without fear of judgment, and warming the world around you with creative inspiration and noble loyalty."
  },
  Virgo: {
    intro: "Your core identity thrives on meticulous refinement, healing intelligence, and humble devotion.",
    details: "As a Virgo Sun, your energy operates as a sacred filter, constantly organizing, purifying, and perfecting. Ruled by analytical Mercury, you find true meaning in service, practical craftsmanship, and physical integration. Your path is not about sterile perfectionism; it is about recognizing the divine order in details, improving systems, and healing the mind-body connection."
  },
  Libra: {
    intro: "Your core identity seeks aesthetic grace, relational harmony, and cosmic justice.",
    details: "As a Libra Sun, your path is a refined search for equilibrium, beauty, and collaborative alignment. Ruled by social Venus, you are naturally gifted at understanding alternative perspectives, creating peace, and designing elegant spaces. Your challenge is learning to assert your true self without diluting your integrity in the name of external compliance or easy harmony."
  },
  Scorpio: {
    intro: "Your core identity burns with transformative intensity, emotional depth, and psychological strength.",
    details: "As a Scorpio Sun, you reside in the deep waters of truth and absolute vulnerability. Ruled by Pluto, your spirit undergoes cyclical deaths and rebirths, rising like a phoenix from the ashes of emotional crises. You have an innate radar for hidden motives, a high threshold for psychological discomfort, and a magnetic power that commands absolute trust and absolute truth."
  },
  Sagittarius: {
    intro: "Your core identity blazes with philosophical curiosity, visionary outlooks, and endless expansion.",
    details: "Under the expansive guidance of Jupiter, your life is a sacred quest for truth, freedom, and far horizons. You embody the spirit of the eternal philosopher-explorer, seeking out foreign lands, high ideas, and high-frequency experiences. Your gift is optimism; you remind a tired world to look up at the stars and trust the expansive wisdom of the universe."
  },
  Capricorn: {
    intro: "Your core identity represents structured ambition, historical integrity, and masterful discipline.",
    details: "As a Capricorn Sun, you climb the mountain of life with slow, unshakable determination. Under Saturn's strict yet rewarding gaze, you understand the value of time, hard work, and structural legacy. You build systems designed to outlive you, thriving in positions of leadership, authority, and elder wisdom. Your maturity is a beacon of reliance."
  },
  Aquarius: {
    intro: "Your core identity pulses with radical individuality, visionary ideals, and humanitarian truth.",
    details: "As an Aquarius Sun, your mind is tuned to the high-frequency waves of the future. Ruled by disruptive Uranus, you challenge stale traditions and champion individual authenticity, cooperative progress, and social equity. You are in the world but not of it, acting as an intellectual catalyst who values friendship and collective alignment over rigid hierarchy."
  },
  Pisces: {
    intro: "Your core identity flows with infinite cosmic empathy, mystical imagination, and ocean-like sensitivity.",
    details: "As a Pisces Sun, you represent the final synthesis of the entire zodiac. Under Neptune's dreamlike veil, you dissolve rigid borders, walking gracefully between the physical and ethereal planes. Your spiritual superpower is boundless compassion, artistic flow, and high psychic receptivity. Your path is learning to anchor your celestial heart in the terrestrial soil."
  }
};

const MOON_INTERPRETATIONS: Record<string, { intro: string; details: string }> = {
  Aries: {
    intro: "Your emotional inner landscape is passionate, direct, and fueled by a need for freedom.",
    details: "You process feelings instantly through action, physical release, or intense self-expression. You find safety in independence and direct honesty."
  },
  Taurus: {
    intro: "Your emotional foundation is deeply steady, patient, and comforted by material luxury.",
    details: "You seek emotional security through sensory routines, reliable environments, financial safety, and nature. Your feelings are slow to shift but highly resilient."
  },
  Gemini: {
    intro: "Your emotional inner world operates through intellect, constant dialogue, and curiosity.",
    details: "You find emotional comfort in talking through your feelings, writing, and logical processing. You need mental stimulation and continuous variety to feel secure."
  },
  Cancer: {
    intro: "Your emotions are ruled by deep, lunar-driven tides, providing intense sensitivity.",
    details: "Your inner world is extremely receptive. You feel the unsaid currents in any room instantly. You need a safe, secure home environment to retreat and recharge."
  },
  Leo: {
    intro: "Your emotional core is generous, proud, and needs to be seen and appreciated.",
    details: "You feel most secure when your creative output and warm heart are recognized. You possess a dramatic, intensely loyal emotional style that protects those you love."
  },
  Virgo: {
    intro: "Your emotional inner landscape is quiet, organized, and finds safety in practical utility.",
    details: "You manage emotional anxiety by taking care of details, organizing your life, and serving others. You feel secure when you are being useful and competent."
  },
  Libra: {
    intro: "Your emotional security is tied to relational peace, beauty, and fairness.",
    details: "You process feelings through dynamic feedback in relationships. You crave an aesthetically soothing home and balanced partnerships to soothe your nervous system."
  },
  Scorpio: {
    intro: "Your emotional depths are intensely private, passionate, and psychologically profound.",
    details: "You experience feelings at their absolute limit. You demand complete loyalty and absolute vulnerability. You possess powerful intuition and a high capacity to heal from crises."
  },
  Sagittarius: {
    intro: "Your emotional inner world is optimistic, adventurous, and craves space.",
    details: "You feel safe when you have the freedom to explore, learn, and wander. You process emotional pain by searching for the silver lining and looking for philosophical meaning."
  },
  Capricorn: {
    intro: "Your emotional center is stoic, highly responsible, and composed.",
    details: "You process feelings by establishing structure, containing your reactions, and achieving goals. You find safety in self-reliance and material preparedness."
  },
  Aquarius: {
    intro: "Your emotional landscape is objective, independent, and socially aware.",
    details: "You process feelings intellectually and value emotional detachment as a safeguard. You feel secure when surrounded by a supportive community of like-minded individualists."
  },
  Pisces: {
    intro: "Your emotional interior is a highly porous, deeply intuitive ocean of feeling.",
    details: "You absorb the emotional energy of others like a sponge. You require quiet solitude, immersion in the arts, and spiritual connection to keep your emotional boundaries intact."
  }
};

const RISING_INTERPRETATIONS: Record<string, { intro: string; details: string }> = {
  Aries: {
    intro: "You project an aura of vibrant vitality, courage, and immediate, direct action.",
    details: "Others perceive you as dynamic, bold, and energetic. You lead with your physical presence, eager to break ground, tackle challenges, and express yourself honestly."
  },
  Taurus: {
    intro: "You project a calm, reliable, and highly refined physical presence.",
    details: "You meet the world with deliberate pacing, a soothing voice, and an elegant aesthetic style. Others trust your quiet stamina and appreciate your grounded charm."
  },
  Gemini: {
    intro: "You project an intellectually alert, conversational, and sparkling social presence.",
    details: "You enter new spaces with rapid gestures, expressive eyes, and immediate conversation. Others see you as witty, adaptable, informative, and deeply engaging."
  },
  Cancer: {
    intro: "You project a gentle, deeply warm, and nurturing protective aura.",
    details: "You greet the world with soft eyes and a quiet, defensive caution. Others instinctively feel safe around you, sensing your high emotional receptivity."
  },
  Leo: {
    intro: "You project a radiant, commanding, and highly charismatic presence.",
    details: "You walk with natural posture, warm posture, and styled self-expression. Others notice your creative flair, expressive pride, and central presence immediately."
  },
  Virgo: {
    intro: "You project a composed, clean, and highly intelligent first impression.",
    details: "You meet new circumstances with observational quiet, clean presentation, and crisp logic. Others see you as capable, helpful, and highly organized."
  },
  Libra: {
    intro: "You project an incredibly charming, symmetrical, and aesthetically pleasant presence.",
    details: "You greet others with a pleasant smile, warm social grace, and elegant attire. You instinctively harmonize any environment you step into, encouraging easy connection."
  },
  Scorpio: {
    intro: "You project a magnetic, intensely focused, and mysterious physical field.",
    details: "You enter rooms with deep, penetrating eyes and a quiet, unreadable composure. Others instinctively sense your emotional strength, psychological authority, and boundaries."
  },
  Sagittarius: {
    intro: "You project a joyful, energetic, and highly expressive philosophical aura.",
    details: "You approach life with an open stance, quick laugh, and expansive gestures. Others view you as inspiring, adventurous, broad-minded, and easy-going."
  },
  Capricorn: {
    intro: "You project a highly dignified, responsible, and professional composure.",
    details: "You present yourself with mature seriousness, structured style, and clean boundaries. Others respect your quiet authority, competence, and reliability."
  },
  Aquarius: {
    intro: "You project a magnetically eccentric, progressive, and highly original presence.",
    details: "You meet the world with an open-minded, intellectually independent stance. Others notice your unique aesthetic and feel instantly accepted in all your individuality."
  },
  Pisces: {
    intro: "You project a soft, dreamy, and highly intuitive, gentle first impression.",
    details: "You possess a glowing, highly fluid aura that shifts depending on the environment. Others find your gentle demeanor, artistic grace, and compassionate presence deeply soothing."
  }
};

const PERSONALITY_MAP: Record<string, { overview: string; strengths: string[]; blindSpots: string[] }> = {
  Aries: {
    overview: "You possess an energetic, pioneering spirit that thrives on starting new journeys and testing boundaries. You are direct, transparent, and absolutely fearless.",
    strengths: ["Unyielding courage", "Spontaneous leadership", "Pioneering drive", "Pure authenticity"],
    blindSpots: ["Impatient pacing", "Difficulty finishing tasks", "Reactive anger", "Self-centered outlook"]
  },
  Taurus: {
    overview: "You represent enduring strength, slow deliberate stamina, and high loyalty. You build lasting structures and cherish physical comfort and deep security.",
    strengths: ["Unshakable reliability", "Quiet determination", "Aesthetic appreciation", "Loyalty"],
    blindSpots: ["Stubborn resistance to change", "Material possessiveness", "Procrastination", "Grudges"]
  },
  Gemini: {
    overview: "You are a cognitive butterfly, constantly connecting ideas, people, and places with quick wit, dynamic storytelling, and high curiosity.",
    strengths: ["Intellectual agility", "Adaptable communication", "Multi-disciplinary intelligence", "Witty charm"],
    blindSpots: ["Superficial attention span", "Restless anxiety", "Gossip tendencies", "Indecisive actions"]
  },
  Cancer: {
    overview: "You hold a profound emotional intelligence, protective instincts, and a rich imagination. You build safe sanctuaries for the soul and value family deeply.",
    strengths: ["High emotional empathy", "Intuitive foresight", "Nurturing devotion", "Ancestral connection"],
    blindSpots: ["Defensive moodiness", "Passive-aggression", "Holding onto the past", "Emotional codependency"]
  },
  Leo: {
    overview: "You radiate warm-hearted creative sovereignty, leadership, and a noble protector style. You inspire others by living life with creative courage.",
    strengths: ["Heart-centered generosity", "Creative flair", "Infectious confidence", "Loyalty"],
    blindSpots: ["Need for continuous approval", "Arrogant pride", "Melodramatic reactions", "Self-absorption"]
  },
  Virgo: {
    overview: "You combine analytical depth with an absolute dedication to refinement and healing service. You find true magic in organizing details and helping others.",
    strengths: ["Meticulous precision", "Practical problem solving", "Pure devotion to service", "Healing energy"],
    blindSpots: ["Sterile perfectionism", "Excessive self-criticism", "Worrying about the future", "Over-analyzing feelings"]
  },
  Libra: {
    overview: "You are a master of relational equilibrium, artistic symmetry, and social mediation. You build bridges and bring elegant alignment wherever you go.",
    strengths: ["Diplomatic social grace", "Aesthetic vision", "Fairness & justice", "Relational intuition"],
    blindSpots: ["People-pleasing hesitation", "Fear of direct conflict", "Indecisive delays", "Aesthetic superficiality"]
  },
  Scorpio: {
    overview: "You possess a magnetic, deeply observant soul that looks beneath masks to uncover psychological truths, demanding absolute vulnerability.",
    strengths: ["Psychological insight", "Unshakable emotional strength", "Absolute loyalty", "Transformative power"],
    blindSpots: ["Secretive control", "Jealous suspicion", "Vindictive memories", "Fear of vulnerability"]
  },
  Sagittarius: {
    overview: "You represent an expansive, philosophical vision of freedom, wandering exploration, and high optimism, constantly seeking out foreign horizons.",
    strengths: ["Visionary optimism", "Philosophical truth", "Endless enthusiasm", "Generosity"],
    blindSpots: ["Blunt insensitivity", "Over-promising limits", "Restless avoidance of routine", "Dogmatic preaching"]
  },
  Capricorn: {
    overview: "You represent structured ambition, masterful self-discipline, and enduring status. You build empires slowly and protect your family and legacy.",
    strengths: ["Disciplined stamina", "Executive leadership", "Real-world competence", "Structural legacy"],
    blindSpots: ["Cold emotional control", "Workaholic neglect of self", "Pessimistic rigidity", "Status obsession"]
  },
  Aquarius: {
    overview: "You are a progressive, forward-thinking intellectual who values radical individuality, cooperative progress, and mental genius.",
    strengths: ["Radical originality", "Visionary ideals", "Collaborative vision", "Objective logic"],
    blindSpots: ["Emotional detachment", "Stubborn contrarianism", "Impatience with slow thinkers", "Fixed dogma"]
  },
  Pisces: {
    overview: "You possess a beautiful, ocean-like sensitivity that flows with infinite cosmic compassion, artistic magic, and deep spiritual receptivity.",
    strengths: ["Boundless cosmic empathy", "Artistic vision", "High psychic intuition", "Selfless devotion"],
    blindSpots: ["Escapist avoidance", "Weak personal boundaries", "Playing the martyr", "Martyr complex"]
  }
};

const COMMUNICATION_MAP: Record<string, string> = {
  Aries: "Your communication style is bold, direct, and action-oriented. You speak with high passion and urgency, saying exactly what you mean. You value immediate, unfiltered honesty above diplomatic hesitation.",
  Taurus: "Your communication is measured, thoughtful, and pragmatic. You speak slowly with a warm, steady tone, and your words carry weight because you only commit to what you can realistically deliver.",
  Gemini: "Your communication is quick-witted, highly expressive, and conversational. You process ideas out loud, blending humor, facts, and engaging storytelling to link people and keep the exchange dynamic.",
  Cancer: "Your communication is deeply intuitive, protective, and emotionally responsive. You speak from the heart, focusing on making others feel safe, and you rely heavily on reading the unspoken tone of an exchange.",
  Leo: "Your communication is warm, theatrical, and highly expressive. You tell stories with heart-centered pride, using dramatic pauses and strong vocabulary to capture attention and inspire those around you.",
  Virgo: "Your communication is precise, structured, and practical. You excel at breaking down complex concepts into actionable details, emphasizing clarity, efficiency, and real-world helpfulness.",
  Libra: "Your communication is highly diplomatic, charming, and cooperative. You possess an innate gift for active listening, balancing opinions, and softening tough truths to ensure harmonious interaction.",
  Scorpio: "Your communication is quiet, intensely focused, and psychologically deep. You speak only when necessary, asking penetrating questions that look beneath superficial facades to get to the core truth.",
  Sagittarius: "Your communication is highly enthusiastic, philosophical, and optimistic. You share concepts like a passionate visionary, using big-picture ideas, stories, and humor to inspire growth.",
  Capricorn: "Your communication is highly professional, concise, and structured. You speak with quiet authority, focusing on real-world logic, timing, and concrete results rather than emotional clutter.",
  Aquarius: "Your communication is intellectually independent, objective, and highly original. You articulate ideas from a high-altitude perspective, challenging conventions with cool logic and visionary insight.",
  Pisces: "Your communication is dreamy, highly metaphorical, and deeply empathetic. You speak in poetic and intuitive terms, transmitting feelings and imagery that transcend literal definitions."
};

const CAREER_MAP: Record<string, string> = {
  Aries: "You thrive in entrepreneurial environments, pioneering startups, or high-octane roles that demand raw leadership, fast decisions, and brave initiative. You are the ultimate self-starter who excels at launching projects.",
  Taurus: "You are designed for high-value asset management, organic design, luxury curation, or long-term investments. You excel at bringing tangible organization, financial safety, and steady growth to your career.",
  Gemini: "You excel in media, public relations, strategic consulting, journalism, or multi-disciplinary writing. You need a fast-paced environment where you can constantly learn, write, speak, and synthesize concepts.",
  Cancer: "You excel in caregiving services, real estate development, intuitive psychology, hospitality, or family legacy building. You thrive in workspaces that value emotional intelligence, safety, and nurturing.",
  Leo: "You belong in high-profile creative directing, artistic fields, entertainment, or inspiring leadership roles. You are at your best when you are managing projects from the heart, leading teams, and sharing your creative light.",
  Virgo: "You are highly suited for diagnostics, systems engineering, edit operations, wellness research, or specialized craftsmanship. You find fulfillment in optimizing workflows, ensuring precision, and fixing complex issues.",
  Libra: "You are built for public advocacy, elegant interior design, contract mediation, or luxury partnerships. You thrive in professional environments that value collaborative harmony, visual beauty, and fairness.",
  Scorpio: "You excel in crisis management, forensic research, psychological therapy, strategic investing, or investigative reporting. You thrive in intense roles that require solving complex mysteries and absolute focus.",
  Sagittarius: "You are designed for global teaching, travel curation, media production, or publishing. You need a career that offers maximum movement, global learning, intellectual freedom, and big-picture visions.",
  Capricorn: "You belong in corporate administration, high-level civil service, structural engineering, or traditional legacy institutions. You climb the professional ladder with quiet authority, building structures that last.",
  Aquarius: "You excel in technological innovation, progressive non-profits, community organizing, or forward-looking research. You require absolute autonomy to design new systems and challenge stale industries.",
  Pisces: "You belong in spiritual healing, musical curation, photography, holistic therapy, or poetic writing. You are highly successful in workspaces that allow you to channel your boundless imagination and compassion."
};

const RELATIONSHIP_MAP: Record<string, string> = {
  Aries: "In relationships, you are intensely passionate, exciting, and absolutely direct. You show love through brave protective actions and active play, but you require a partner who respects your independent freedom.",
  Taurus: "In relationships, you are incredibly loyal, sensual, and physically warm. You build love on a foundation of sensory routines, gourmet meals, financial safety, and quiet, enduring loyalty.",
  Gemini: "In relationships, you seek a mental partnership, witty banter, and endless curiosity. You connect through sharing concepts, going on spontaneous trips, and laughing together; stagnation is your dealbreaker.",
  Cancer: "In relationships, you seek absolute emotional safety, deep family commitment, and home-centered intimacy. You love deeply by nurturing your partner, but you require safe boundaries and absolute validation.",
  Leo: "In relationships, you are exceptionally generous, loyal, and passionate. You shower your partner with warm attention and luxurious gifts, but you need to be adored, respected, and publicly celebrated in return.",
  Virgo: "In relationships, you show love through continuous practical acts of service and devotion. You are a steady, highly reliable partner who helps solve problems and supports your partner's growth every single day.",
  Libra: "In relationships, you represent the ultimate romantic diplomat, seeking elegant symmetry and peaceful harmony. You love shared experiences, aesthetic dates, and mutual growth, avoiding raw friction.",
  Scorpio: "In relationships, you seek complete spiritual intimacy, absolute loyalty, and psychological depth. You love with transformative intensity, demanding absolute truth and offering a love that survives any crisis.",
  Sagittarius: "In relationships, you seek a fellow explorer and philosophical ally. You connect through travel, philosophical debates, and laughter, requiring an expansive lease on your personal independence.",
  Capricorn: "In relationships, you show love through unwavering dependability, structural protection, and planning. You seek a reliable partnership built on shared values, status, and long-term legacy.",
  Aquarius: "In relationships, you are objective, independent, and values-driven. You require a foundation of deep mental friendship and absolute respect for your unique individuality, avoiding codependency.",
  Pisces: "In relationships, you represent the ultimate celestial romantic, loving with boundless cosmic compassion. You seek a soul-level connection, flowing with gentle empathy, creative magic, and mutual support."
};

const PURPOSE_MAP: Record<string, string> = {
  Aries: "Your life purpose is to discover raw individual courage, break new ground, and trust your intuition. You are here to learn to lead without waiting for approval, claiming your authentic space.",
  Taurus: "Your life purpose is to cultivate self-worth, grounded stability, and lasting value. You are here to learn patience, celebrate nature, and build a peaceful sanctuary of security.",
  Gemini: "Your life purpose is to act as a cosmic translator, connecting concepts and bridging groups. You are here to cultivate mental flexibility, share knowledge, and explore diverse realities.",
  Cancer: "Your life purpose is to master emotional intelligence, honor your roots, and protect vulnerability. You are here to build safe sanctuaries and learn the sacred art of healthy boundaries.",
  Leo: "Your life purpose is to step onto the stage of your life, express your creative truth from the heart, and inspire others. You are here to learn noble self-acceptance and share your warm solar joy.",
  Virgo: "Your life purpose is to perfect your practical craft, optimize complex systems, and offer healing service. You are here to learn that divine order is found in the details of service.",
  Libra: "Your life purpose is to master collaborative justice, aesthetic harmony, and relational balance. You are here to learn the art of compromise while maintaining your individual integrity.",
  Scorpio: "Your life purpose is to undergo deep psychological transformation, rising from crises with spiritual power. You are here to look beyond facades and master the emotional mysteries of trust.",
  Sagittarius: "Your life purpose is to expand your consciousness, seek high philosophical truth, and share optimism. You are here to discover freedom and remind others to trust the grand design.",
  Capricorn: "Your life purpose is to master real-world competence, mature authority, and build lasting legacy structures. You are here to take responsibility and command respect with integrity.",
  Aquarius: "Your life purpose is to champion progressive innovation, humanitarian equity, and authentic individuality. You are here to design the systems of the future and value the collective good.",
  Pisces: "Your life purpose is to master boundless compassion, channel ethereal imagination, and trust the divine flow. You are here to dissolve borders and heal the terrestrial world with cosmic magic."
};

const PLANETARY_HIGHLIGHTS: Record<string, string> = {
  Fire: "Your fire-heavy planetary focus directs high enthusiasm, impulsive willpower, and creative drive into your actions. You are wired to conquer obstacles and initiate bold breakthroughs.",
  Earth: "Your earth-heavy planetary focus directs steady discipline, pragmatic logic, and sensory appreciation into your life. You focus on securing concrete results and real-world stability.",
  Air: "Your air-heavy planetary focus directs mental clarity, brilliant social intelligence, and objective curiosity into your path. You navigate life through concepts, communication, and connectivity.",
  Water: "Your water-heavy planetary focus directs extreme emotional receptivity, psychic intuition, and infinite empathy into your journey. You navigate life by reading energy and trusting your heart."
};

const COSMIC_ADVICE: Record<string, string> = {
  Aries: "Set aside 10 minutes every morning for high-intensity physical movement to release accumulated Mars tension. Practice active listening—allow a moment of quiet before responding to others.",
  Taurus: "Incorporate a weekly grounding ritual: walk barefoot on soil or spend quiet time in nature. Balance your appreciation for material comfort by decluttering items that no longer serve your growth.",
  Gemini: "Practice daily quiet meditation or journaling to calm your rapid Mercurial mind. Focus on finishing one primary task completely before allowing your curious intellect to wander to new projects.",
  Cancer: "Create a private physical sanctuary in your home where your energy is completely protected. Align your schedule with the lunar cycle: rest during the new moon, and express creatively during the full moon.",
  Leo: "Engage in a weekly heart-centered creative practice strictly for joy, without seeking external validation or monetization. Cultivate quiet gratitude to feed your noble spirit.",
  Virgo: "Practice conscious self-compassion: remind yourself that your worth is not tied to endless productivity. Dedicate time to a digital detox routine each night to soothe your active mind.",
  Libra: "Schedule regular 'solo dates' to reconnect with your authentic desires without relational input. Practice saying a clear 'no' when a request compromises your individual peace.",
  Scorpio: "Engage in emotional release practices like deep breathwork or therapeutic journaling. Build trust slowly by practicing micro-disclosures of vulnerability with those who have earned your loyalty.",
  Sagittarius: "Establish a daily grounding routine to anchor your expansive visions in reality. Honor your need for travel by exploring local, unfamiliar neighborhoods or starting a new philosophical study.",
  Capricorn: "Practice delegating tasks to trust others and relieve your immense Saturnian burden. Ensure you separate your self-worth from your professional status by celebrating your quiet personal moments.",
  Aquarius: "Balance your high-altitude intellectual planning with warm, face-to-face heart connections. Dedicate time to creative individual expressions that are separate from collective or social goals.",
  Pisces: "Establish a rigorous daily energetic cleansing ritual (such as salt baths or visualization) to clear absorbed external energies. Anchor your infinite empathy in solid personal boundaries."
};

export function generateAstrologyReport(month: number, day: number, hour: number, minute: number): AstrologyReportNarrative {
  const { sun, moon, rising } = calculateNatalParameters(month, day, hour, minute);

  const sunData = SUN_INTERPRETATIONS[sun] || SUN_INTERPRETATIONS["Leo"];
  const moonData = MOON_INTERPRETATIONS[moon] || MOON_INTERPRETATIONS["Cancer"];
  const risingData = RISING_INTERPRETATIONS[rising] || RISING_INTERPRETATIONS["Libra"];
  
  const personality = PERSONALITY_MAP[sun] || PERSONALITY_MAP["Leo"];
  const comm = COMMUNICATION_MAP[sun] || COMMUNICATION_MAP["Leo"];
  const career = CAREER_MAP[sun] || CAREER_MAP["Leo"];
  const rel = RELATIONSHIP_MAP[sun] || RELATIONSHIP_MAP["Leo"];
  const purp = PURPOSE_MAP[sun] || PURPOSE_MAP["Leo"];
  
  const element = SIGN_ELEMENTS[sun] || "Fire";
  const planetaryInfo = PLANETARY_HIGHLIGHTS[element] || PLANETARY_HIGHLIGHTS["Fire"];
  const advice = COSMIC_ADVICE[sun] || COSMIC_ADVICE["Leo"];

  return {
    sunSign: sun,
    sunIntro: sunData.intro,
    sunDetails: sunData.details,
    moonSign: moon,
    moonIntro: moonData.intro,
    moonDetails: moonData.details,
    risingSign: rising,
    risingIntro: risingData.intro,
    risingDetails: risingData.details,
    
    personalityOverview: personality.overview,
    strengths: personality.strengths,
    blindSpots: personality.blindSpots,
    
    communicationStyle: comm,
    careerWealth: career,
    relationships: rel,
    lifePurpose: purp,
    
    planetaryHighlights: planetaryInfo,
    cosmicAdvice: advice
  };
}
