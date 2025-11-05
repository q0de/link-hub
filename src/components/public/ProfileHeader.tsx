import { Profile, Theme } from '../../types/database'

interface ProfileHeaderProps {
  profile: Profile
  theme: Theme
}

export default function ProfileHeader({ profile, theme }: ProfileHeaderProps) {
  return (
    <div>
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.username}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4"
          style={{ borderColor: theme.accentColor }}
        />
      ) : (
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold border-4"
          style={{ borderColor: theme.accentColor, backgroundColor: theme.accentColor + '20' }}
        >
          {profile.username.charAt(0).toUpperCase()}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
      {profile.bio && (
        <p className="text-lg opacity-80 max-w-md mx-auto">{profile.bio}</p>
      )}
    </div>
  )
}

