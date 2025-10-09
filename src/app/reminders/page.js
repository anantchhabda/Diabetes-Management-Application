import Script from "next/script";

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div id="remindersApp">
        <main className="flex flex-col justify-center items-center px-4 gap-4 pt-8">
          <h1 className="text-2xl font-bold text-[var(--color-textWhite)]">
            Current Reminders
          </h1>

          {/* add reminder*/}
          <button
            type="button"
            className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
            id="addReminderBtn"
          >
            Add Reminder
          </button>

          {/* temporary notifications pop */}
          <div
            id="notificationPrompt"
            className="transition-all duration-500 opacity-100 bg-white/10 border border-white/20 text-[var(--color-textWhite)] text-sm rounded-md px-3 py-2 mt-2 shadow-sm max-w-md"
            style={{ backdropFilter: "blur(6px)" }}
          >
            <span className="opacity-90">
              🔔 Enable notifications to receive reminder alerts even if the app
              is closed.
            </span>
            <button
              id="enableNotificationsBtn"
              type="button"
              className="ml-2 underline font-semibold hover:text-[var(--color-tertiary)] focus:outline-none"
              aria-label="Enable notifications"
            >
              Enable
            </button>
          </div>

          {/* reminder renders list */}
          <div id="remindersList" className="w-full max-w-md mt-2" />

          {/* Scripts */}
          <Script src="/js/reminders.js" strategy="afterInteractive" />
          <Script src="/js/notifications.js" strategy="afterInteractive" />

          {/* fade when notifications enabled! */}
          <Script id="notif-prompt-fade" strategy="afterInteractive">
            {`
              (function () {
                function hidePrompt() {
                  var box = document.getElementById('notificationPrompt');
                  if (!box) return;
                  box.classList.add('opacity-0');
                  setTimeout(function(){ box && box.remove(); }, 600);
                }

                function wire() {
                  var btn = document.getElementById('enableNotificationsBtn');
                  var hasAPI = typeof window !== 'undefined' && 'Notification' in window;

                  // If already granted, remove immediately
                  if (hasAPI && Notification.permission === 'granted') {
                    hidePrompt();
                    return;
                  }

                  if (btn && !btn.dataset.wired) {
                    btn.dataset.wired = '1';
                    btn.addEventListener('click', async function () {
                      try {
                        // Use the existing global helper if present (shows a small local SW toast too)
                        if (window.enableNotifications) {
                          await window.enableNotifications();
                        } else if (hasAPI) {
                          const res = await Notification.requestPermission();
                          if (res !== 'granted') return;
                        }
                        // Fade away if permission is now granted
                        if (!hasAPI || Notification.permission === 'granted') {
                          hidePrompt();
                        }
                      } catch (e) {
                        // no-op; user can try again
                        console.error('[DMA][page] enable notifications error:', e);
                      }
                    });
                  }
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', wire, { once: true });
                } else {
                  wire();
                }
              })();
            `}
          </Script>
        </main>
      </div>
    </div>
  );
}
