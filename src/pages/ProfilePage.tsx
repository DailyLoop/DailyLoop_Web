// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      // If no profile exists, create one via upsert
      if (!data) {
        const newProfile: Profile = {
          id: user!.id, 
          email: user!.email || '',
          display_name: '', // or default display name
          avatar_url: '',
          bio: '',
          website: '',
          location: '',
          preference: {},
        };
        
        console.log('New profile data to upsert:', newProfile);
        
        const { error } = await supabase.from('profiles').upsert(newProfile);
        if (error) {
          console.error('Upsert error:', error);
        }
          
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert(newProfile);
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
      // Optionally, you can refetch the profile here or show a success message
    } catch (err: any) {
      setError(err.message);
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={updateProfile} className="space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block mb-1">Email (read-only)</label>
            <input
              type="text"
              name="email"
              value={profile.email}
              readOnly
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Display Name */}
          <div>
            <label className="block mb-1">Display Name</label>
            <input
              type="text"
              name="display_name"
              value={profile.display_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Avatar URL */}
          <div>
            <label className="block mb-1">Avatar URL</label>
            <input
              type="text"
              name="avatar_url"
              value={profile.avatar_url}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Website */}
          <div>
            <label className="block mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Location */}
          <div>
            <label className="block mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
          </div>
          {/* Submit Button */}
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;