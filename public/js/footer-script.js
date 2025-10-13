function updateFooterText() {
  const footerText = document.getElementById('footerText');
  if (!footerText) return;

  try {
    // Get viewing user's data
    const viewingUserData = JSON.parse(localStorage.getItem('viewingUserData') || '{}');
    const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Only update if we're viewing someone else's profile
    if (viewingUserData.id && viewingUserData.id !== currentUserData.id) {
      const name = viewingUserData.name || 'this user';
      footerText.textContent = `You are viewing ${name}'s account. Return to your account`;
    }
  } catch (error) {
    console.error('Error updating footer text:', error);
  }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', updateFooterText);

// Also run when localStorage changes
window.addEventListener('storage', updateFooterText);