import Script from "next/script";

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div id="remindersApp">
        <main className="flex flex-col justify-center items-center px-4 gap-4 pt-8">
          <h1
            className="text-2xl font-bold text-[var(--color-textWhite)]"
            data-i18n="current_reminders"
          >
            Current Reminders
          </h1>

          <button
            type="button"
            className="w-full max-w-xs py-3 bg-[var(--color-tertiary)] text-[var(--color-textWhite)] text-lg rounded-md text-center font-semibold hover:opacity-90 transition"
            id="addReminderBtn"
            data-i18n="add_reminder"
          >
            Add Reminder
          </button>

          <div
            id="notificationPrompt"
            className="transition-all duration-500 opacity-100 bg-white/10 border border-white/20 text-[var(--color-textWhite)] text-sm rounded-md px-3 py-2 mt-2 shadow-sm max-w-md"
            style={{ backdropFilter: "blur(6px)" }}
          >
            <span className="opacity-90" data-i18n="notif_enable_desc">
              🔔 Enable notifications to receive reminder alerts even if the app
              is closed.
            </span>
            <button
              id="enableNotificationsBtn"
              type="button"
              className="ml-2 underline font-semibold hover:text-[var(--color-tertiary)] focus:outline-none"
              aria-label="Enable notifications"
              data-i18n="enable"
            >
              Enable
            </button>
          </div>

          <div id="remindersList" className="w-full max-w-md mt-2" />

          {/* bump version to defeat caching*/}
          <Script src="/js/reminders.js?v=3" strategy="afterInteractive" />
          <Script src="/js/notifications.js?v=3" strategy="afterInteractive" />

          {/* localize static chrome + fade prompt when granted */}
          <Script id="reminders-static-i18n" strategy="afterInteractive">
            {`
              (function(){
                function dict(){var d=window.__i18n&&window.__i18n.dict;return (typeof d==="function"?d():d)||{};}
                function t(k,f){var d=dict();return (d&&d[k])!=null?String(d[k]):(f||k);}
                function apply(){
                  var h=document.querySelector('[data-i18n="current_reminders"]');
                  if(h) h.textContent=t('current_reminders','Current Reminders');
                  var add=document.querySelector('#addReminderBtn');
                  if(add) add.textContent=t('add_reminder','Add Reminder');
                  var span=document.querySelector('#notificationPrompt [data-i18n="notif_enable_desc"]');
                  if(span) span.textContent=t('notif_enable_desc','🔔 Enable notifications to receive reminder alerts even if the app is closed.');
                  var btn=document.getElementById('enableNotificationsBtn');
                  if(btn){btn.textContent=t('enable','Enable'); btn.setAttribute('aria-label', t('enable','Enable'));}
                }
                function whenReady(fn){
                  var want=(document.documentElement&&document.documentElement.lang)||"en";
                  var tries=0; (function tick(){
                    var ok=window.__i18n && window.__i18n.lang===want && window.__i18n.dict && Object.keys(window.__i18n.dict).length>0;
                    if(ok) return fn();
                    if(++tries>=20) return fn();
                    setTimeout(tick,25);
                  })();
                }
                function watch(){
                  try{
                    var mo=new MutationObserver(function(){ whenReady(apply); });
                    mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
                  }catch(_){}
                }
                if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded', function(){ whenReady(apply); watch(); }, {once:true});}
                else { whenReady(apply); watch(); }
              })();
            `}
          </Script>

          {/* fade when notifications enabled */}
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
                  if (hasAPI && Notification.permission === 'granted') { hidePrompt(); return; }
                  if (btn && !btn.dataset.wired) {
                    btn.dataset.wired = '1';
                    btn.addEventListener('click', async function () {
                      try {
                        if (window.enableNotifications) {
                          await window.enableNotifications();
                        } else if (hasAPI) {
                          const res = await Notification.requestPermission();
                          if (res !== 'granted') return;
                        }
                        if (!hasAPI || Notification.permission === 'granted') {
                          hidePrompt();
                        }
                      } catch (e) {
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
