import Script from 'next/script';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    const viewingUserData = JSON.parse(localStorage.getItem('viewingUserData') || '{}');
    
    if (viewingUserData.id && viewingUserData.id !== currentUserData.id) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 bg-[var(--color-secondary)] text-[var(--color-textWhite)] py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <p id="footerText" className="text-sm sm:text-base">
            You are viewing another user&apos;s account.
          </p>
          <button
            onClick={() => window.location.href = '/patient-homepage'}
            className="bg-[var(--color-tertiary)] hover:bg-[var(--color-accent)] transition-colors duration-300 text-white px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Return to Account
          </button>
        </div>
      </footer>
      <Script
        src={`/js/footer-script.js?v=${Date.now()}`}
        strategy="afterInteractive"
      />
    </>
  );
}