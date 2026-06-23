export const playAnniversaryWish = (employee: {
  name: string;
  milestone: string;
  role_title: string;
  department: string;
}) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech narration
  window.speechSynthesis.cancel();

  const milestoneClean = employee.milestone.replace(' Anniversary', '');
  const phrase = `Happy ${milestoneClean} Work Anniversary, ${employee.name}! Thank you for being our incredible ${employee.role_title} in ${employee.department}!`;

  const utterance = new SpeechSynthesisUtterance(phrase);

  // Retrieve voices from browser speech engine
  let voices = window.speechSynthesis.getVoices();

  // Web Speech API voices might be loaded asynchronously
  const speakUtterance = () => {
    const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (englishVoices.length > 0) {
      // Modulate voice selection deterministically based on employee name
      const charSum = employee.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const voiceIndex = charSum % englishVoices.length;
      utterance.voice = englishVoices[voiceIndex];
    }

    // Set pitch (enthusiastic greeting: 1.1 to 1.3) and rate values
    const seed = employee.name.length;
    utterance.pitch = 1.1 + (seed % 3) * 0.1; // 1.1, 1.2, or 1.3
    utterance.rate = 0.95 + (seed % 2) * 0.05; // 0.95 or 1.0
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      speakUtterance();
    };
  } else {
    speakUtterance();
  }
};
