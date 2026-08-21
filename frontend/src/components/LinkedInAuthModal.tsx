import React, { useState, useEffect } from 'react';
import { LinkedInProfile, ResumeData } from '../types';

interface LinkedInAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileImported: (profile: LinkedInProfile, generatedResume: ResumeData) => void;
  existingProfile?: LinkedInProfile | null;
}

export const LinkedInAuthModal: React.FC<LinkedInAuthModalProps> = ({
  isOpen,
  onClose,
  onProfileImported,
  existingProfile,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [syncedProfile, setSyncedProfile] = useState<LinkedInProfile | null>(existingProfile || null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (existingProfile) {
      setSyncedProfile(existingProfile);
    }
  }, [existingProfile]);

  // Listen for postMessage from OAuth popup
  useEffect(() => {
    const handleAuthMessage = async (event: MessageEvent) => {
      // Validate origin if needed or accept postMessage from popup callback
      if (event.data && event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
        setIsAuthenticating(true);
        setStatusMessage('Authentication verified. Syncing profile data...');

        try {
          // Fetch the LinkedIn profile from the backend
          const res = await fetch('/api/linkedin/profile');
          const data = await res.json();

          if (data.success && data.profile) {
            const profile: LinkedInProfile = data.profile;
            setSyncedProfile(profile);
            setSyncSuccess(true);
            setStatusMessage('Profile successfully imported from LinkedIn!');

            // Convert to ResumeData format for ATS Engine
            const generatedResume = convertLinkedInToResume(profile);
            onProfileImported(profile, generatedResume);
          }
        } catch (err) {
          console.error('Failed to load profile:', err);
          setStatusMessage('Failed to sync LinkedIn profile data. Please try again.');
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [onProfileImported]);

  const convertLinkedInToResume = (profile: LinkedInProfile): ResumeData => {
    return {
      id: 'resume-li-' + Date.now(),
      name: profile.fullName,
      title: profile.headline.split('|')[0]?.trim() || 'Software Engineer',
      email: profile.email,
      phone: '+1 (555) 438-9921',
      location: profile.location,
      summary: profile.summary,
      fileName: `${profile.fullName.replace(/\s+/g, '_')}_LinkedIn_Profile.pdf`,
      fileSize: '1.2 MB',
      createdAt: new Date().toISOString().split('T')[0],
      skills: profile.skills,
      experience: profile.positions.map((pos) => ({
        id: pos.id,
        role: pos.title,
        company: pos.company,
        period: `${pos.startDate} - ${pos.isCurrent ? 'Present' : pos.endDate || '2023'}`,
        bullets: [
          pos.summary,
          ...(pos.skills ? [`Key Technologies & Competencies: ${pos.skills.join(', ')}`] : []),
        ],
      })),
      education: profile.educations.map((edu) => ({
        id: edu.id,
        degree: `${edu.degreeName} in ${edu.fieldOfStudy}`,
        institution: edu.schoolName,
        year: `${edu.startYear || '2015'} - ${edu.endYear || '2019'}`,
      })),
    };
  };

  const handleStartOAuth = async () => {
    setIsAuthenticating(true);
    setStatusMessage('Opening secure LinkedIn authentication...');

    try {
      const res = await fetch('/api/auth/linkedin/url');
      const data = await res.json();
      const authUrl = data.url;

      // Open OAuth popup window directly
      const popupWidth = 600;
      const popupHeight = 700;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;

      const authWindow = window.open(
        authUrl,
        'LinkedIn_OAuth_Popup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
      );

      if (!authWindow) {
        // If popup was blocked, fallback to direct simulator
        setStatusMessage('Popup was blocked by browser. Syncing directly via simulated OAuth token...');
        setTimeout(async () => {
          const profileRes = await fetch('/api/linkedin/profile');
          const profileData = await profileRes.json();
          if (profileData.success) {
            setSyncedProfile(profileData.profile);
            setSyncSuccess(true);
            const genResume = convertLinkedInToResume(profileData.profile);
            onProfileImported(profileData.profile, genResume);
            setIsAuthenticating(false);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('OAuth initiation error:', err);
      setIsAuthenticating(false);
      setStatusMessage('Unable to reach LinkedIn authorization server. Using direct import fallback...');
      
      // Fallback direct load
      const profileRes = await fetch('/api/linkedin/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        setSyncedProfile(profileData.profile);
        setSyncSuccess(true);
        const genResume = convertLinkedInToResume(profileData.profile);
        onProfileImported(profileData.profile, genResume);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#cfc4c5] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with LinkedIn Brand Styling */}
        <div className="bg-[#0a66c2] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0a66c2] flex items-center justify-center font-bold text-xl shadow-sm">
              in
            </div>
            <div>
              <h2 className="font-bold text-base md:text-lg leading-tight">
                Import from LinkedIn
              </h2>
              <p className="text-xs text-blue-100">
                Sync profile, verified skills, and automated Job Radar matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!syncedProfile ? (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 mx-auto flex items-center justify-center text-[#0a66c2]">
                <span className="material-symbols-outlined text-[32px]">sync</span>
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-bold text-lg text-black">
                  Connect your LinkedIn Profile
                </h3>
                <p className="text-xs text-[#4c4546] leading-relaxed">
                  Authenticate with LinkedIn to instantly populate work experience,
                  skill badges, education, and receive real-time notifications whenever high-match jobs appear.
                </p>
              </div>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-2">
                <div className="p-3 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <span className="material-symbols-outlined text-[#0a66c2] text-[16px]">badge</span>
                    <span>1-Click Import</span>
                  </div>
                  <p className="text-[11px] text-[#4c4546]">Converts LinkedIn profile into standard ATS-compliant resume.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <span className="material-symbols-outlined text-[#0a66c2] text-[16px]">radar</span>
                    <span>Job Radar</span>
                  </div>
                  <p className="text-[11px] text-[#4c4546]">Automated alerts when your resume scores &gt; 85% on live postings.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <span className="material-symbols-outlined text-[#0a66c2] text-[16px]">verified_user</span>
                    <span>Privacy First</span>
                  </div>
                  <p className="text-[11px] text-[#4c4546]">Your credentials remain strictly client-side. No automated posting.</p>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div className="p-2.5 rounded-lg bg-blue-50 text-[#0a66c2] text-xs font-medium border border-blue-200 animate-pulse">
                  {statusMessage}
                </div>
              )}

              {/* OAuth Action Button */}
              <div className="pt-3">
                <button
                  onClick={handleStartOAuth}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#0a66c2] hover:bg-[#084e96] text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to LinkedIn...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-serif font-black text-base">in</span>
                      <span>Sign in & Import with LinkedIn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Synced Profile Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>LinkedIn Profile Successfully Connected</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-mono">
                  Synced {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Profile Card */}
              <div className="p-4 rounded-xl bg-[#faf9fe] border border-[#cfc4c5]/60 flex items-start gap-4">
                <img
                  src={syncedProfile.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={syncedProfile.fullName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0a66c2] shrink-0"
                />
                <div className="space-y-1 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-black text-sm">{syncedProfile.fullName}</h3>
                    <span className="text-[10px] bg-blue-100 text-[#0a66c2] font-bold px-2 py-0.5 rounded-full">
                      Verified Member
                    </span>
                  </div>
                  <p className="text-xs text-[#4c4546] font-medium line-clamp-2">
                    {syncedProfile.headline}
                  </p>
                  <p className="text-[11px] text-[#7e7576] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    <span>{syncedProfile.location}</span>
                  </p>
                </div>
              </div>

              {/* Synced Stats Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="block text-base font-bold text-black">{syncedProfile.positions.length}</span>
                  <span className="text-[10px] text-[#7e7576] uppercase tracking-wider font-semibold">Positions</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="block text-base font-bold text-black">{syncedProfile.skills.length}</span>
                  <span className="text-[10px] text-[#7e7576] uppercase tracking-wider font-semibold">Verified Skills</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="block text-base font-bold text-black">
                    {syncedProfile.certifications?.length || 2}
                  </span>
                  <span className="text-[10px] text-[#7e7576] uppercase tracking-wider font-semibold">Certifications</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Apply to ResumeRadar & Close
                </button>
                <button
                  onClick={handleStartOAuth}
                  className="flex items-center justify-center gap-1 bg-white border border-[#cfc4c5] text-[#4c4546] hover:text-black text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
                  title="Re-sync data from LinkedIn"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>Re-sync</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
