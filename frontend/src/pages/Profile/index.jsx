import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth.context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    jobDomain: user?.job?.domain || '',
    jobRole: user?.job?.role || '',
    jobLevel: user?.job?.level || '',
    habits: user?.about?.habits || '',
    workingHoursPerDay: user?.about?.workingHoursPerDay || '',
    peakProductivityHours: user?.about?.peakProductivityHours || '',
    moreAboutYourself: user?.about?.moreAboutYourself || '',
  });

  const [saved, setSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (!user) return;

    updateProfile({
      name: formData.name,
      age: Number(formData.age) || 0,
      job: {
        domain: formData.jobDomain,
        role: formData.jobRole,
        level: formData.jobLevel,
      },
      about: {
        habits: formData.habits,
        workingHoursPerDay: Number(formData.workingHoursPerDay) || 0,
        peakProductivityHours: formData.peakProductivityHours,
        moreAboutYourself: formData.moreAboutYourself,
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth')
    // router.push('/auth');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <p className="text-foreground mb-4">Please log in first</p>
          <Button onClick={() => navigate('/auth')}>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">TF</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
              <p className="text-muted-foreground">Personal Profile</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Saved notification */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm font-medium">Profile updated successfully!</p>
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info Card with Live Preview */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div>
              {/* Profile Header */}
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {formData.name ? formData.name[0].toUpperCase() : 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">{formData.name || 'Your Name'}</h2>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                  {formData.age && (
                    <p className="text-muted-foreground text-sm">{formData.age} years old</p>
                  )}
                </div>
              </div>

              {/* Job Information Preview */}
              {(formData.jobRole || formData.jobDomain || formData.jobLevel) && (
                <div className="mb-5 pb-5 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Job Information
                  </p>
                  <div className="space-y-3">
                    {formData.jobDomain && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Domain</p>
                        <p className="text-foreground text-sm mt-0.5">{formData.jobDomain}</p>
                      </div>
                    )}
                    {formData.jobRole && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Role</p>
                        <p className="text-foreground text-sm mt-0.5">{formData.jobRole}</p>
                      </div>
                    )}
                    {formData.jobLevel && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Level</p>
                        <p className="text-foreground text-sm mt-0.5">{formData.jobLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Habits Preview */}
              {formData.habits && (
                <div className="mb-5 pb-5 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Habits
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">{formData.habits}</p>
                </div>
              )}

              {/* Working Hours & Peak Productivity Preview */}
              {(formData.workingHoursPerDay || formData.peakProductivityHours) && (
                <div className="mb-5 pb-5 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Productivity
                  </p>
                  <div className="space-y-3">
                    {formData.workingHoursPerDay && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Working Hours per Day</p>
                        <p className="text-foreground text-sm mt-0.5">{formData.workingHoursPerDay} hours</p>
                      </div>
                    )}
                    {formData.peakProductivityHours && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Peak Productivity Hours</p>
                        <p className="text-foreground text-sm mt-0.5">{formData.peakProductivityHours}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* More About Yourself Preview */}
              {formData.moreAboutYourself && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    About You
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">{formData.moreAboutYourself}</p>
                </div>
              )}

              {/* Empty State */}
              {!formData.jobRole && !formData.jobDomain && !formData.jobLevel && !formData.habits && !formData.workingHoursPerDay && !formData.peakProductivityHours && !formData.moreAboutYourself && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-xs">Fill in the form to see your complete profile</p>
                </div>
              )}
            </div>
          </Card>

          {/* Right Section - Form */}
          <Card className="lg:col-span-2 p-6">
            <form className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-foreground mb-2">
                      Age
                    </label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Job Information Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="jobDomain" className="block text-sm font-medium text-foreground mb-2">
                      Domain
                    </label>
                    <Input
                      id="jobDomain"
                      name="jobDomain"
                      type="text"
                      placeholder="e.g. Software, Design, Marketing"
                      value={formData.jobDomain}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="jobRole" className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <Input
                      id="jobRole"
                      name="jobRole"
                      type="text"
                      placeholder="e.g. Developer, Designer, Manager"
                      value={formData.jobRole}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="jobLevel" className="block text-sm font-medium text-foreground mb-2">
                      Level
                    </label>
                    <Input
                      id="jobLevel"
                      name="jobLevel"
                      type="text"
                      placeholder="e.g. Junior, Senior, Lead"
                      value={formData.jobLevel}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* About Yourself Section */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-bold text-foreground mb-4">About Yourself</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="habits" className="block text-sm font-medium text-foreground mb-2">
                      Habits
                    </label>
                    <Textarea
                      id="habits"
                      name="habits"
                      placeholder="Describe your daily habits..."
                      value={formData.habits}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="workingHours" className="block text-sm font-medium text-foreground mb-2">
                        Working Hours per Day
                      </label>
                      <Input
                        id="workingHours"
                        name="workingHoursPerDay"
                        type="number"
                        step="0.5"
                        placeholder="e.g. 8"
                        value={formData.workingHoursPerDay}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="peakHours" className="block text-sm font-medium text-foreground mb-2">
                        Peak Productivity Hours
                      </label>
                      <Input
                        id="peakHours"
                        name="peakProductivityHours"
                        type="text"
                        placeholder="e.g. 9am - 12pm"
                        value={formData.peakProductivityHours}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="more" className="block text-sm font-medium text-foreground mb-2">
                      More About Yourself
                    </label>
                    <Textarea
                      id="more"
                      name="moreAboutYourself"
                      placeholder="Share more about yourself, your goals, interests..."
                      value={formData.moreAboutYourself}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-border pt-6 flex gap-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
