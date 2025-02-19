// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import LandingHeader from '../components/layout/LandingHeader';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  location: string;
  preference: any;
  created_at?: string;
  updated_at?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);  // Add this line
  const [profile, setProfile] = useState<Profile>({
    id: '',
    email: '',
    display_name: '',
    avatar_url: '',
    bio: '',
    website: '',
    location: '',
    preference: {},
  });

  const handleLogoClick = () => {
    navigate('/');
  };

  // Fetch profile data when the component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log('Authenticated user:', user);
      fetchProfile();
    }
  }, [user]);

  // Fetch the profile using maybeSingle() so that it returns null if not found
  async function fetchProfile() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        const newProfile: Profile = {
          id: user!.id, 
          email: user!.email || '',
          display_name: '',
          avatar_url: '',
          bio: '',
          website: '',
          location: '',
          preference: {},
        };
        
        console.log('New profile data to upsert:', newProfile);
        
        const { error: upsertError } = await supabase.from('profiles').upsert(newProfile);
        if (upsertError) throw upsertError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Update the profile in Supabase
  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
          preference: profile.preference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  if (!user) {
    return <div className="p-4 text-center">Please sign in to view your profile.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <LandingHeader onLogoClick={handleLogoClick} />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition duration-200"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Avatar preview with fallback to letter */}
            <div className="flex justify-center mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center border-2 border-gray-600">
                  <span className="text-white text-3xl font-semibold">
                    {profile.display_name && profile.display_name[0] 
                      ? profile.display_name[0].toUpperCase()
                      : profile.email && profile.email[0]
                        ? profile.email[0].toUpperCase()
                        : '?'}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={updateProfile} className="space-y-5">
              {/* Form fields with readonly toggle */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Email (read-only)
                </label>
                <input
                  type="text"
                  name="email"
                  value={profile.email}
                  readOnly
                  className="w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 cursor-not-allowed"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Display Name
                </label>
                <input
                  type="text"
                  name="display_name"
                  value={profile.display_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Other fields follow the same pattern - add readOnly={!isEditing} */}
              {/* Avatar URL */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatar_url"
                  value={profile.avatar_url}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'cursor-not-allowed'
                  }`}
                />
              </div>
              {/* Bio */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  rows={3}
                  className={`w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'cursor-not-allowed'
                  }`}
                />
              </div>
              {/* Website */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'cursor-not-allowed'
                  }`}
                />
              </div>
              {/* Location */}
              <div>
                <label className="block mb-1 font-semibold text-gray-200">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full p-2 rounded border border-gray-700 bg-gray-700 text-gray-300 ${
                    isEditing
                      ? 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'cursor-not-allowed'
                  }`}
                />
              </div>
              {/* Submit Button - only show when editing */}
              {isEditing && (
                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;