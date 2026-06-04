import { Avatar } from '@mui/material';
import type { AvatarProps } from '@mui/material';

interface CustomAvatarProps extends Omit<AvatarProps, 'src'> {
  name: string;
  imgUrl?: string;
}

const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const CustomAvatar = ({ name, imgUrl, sx, ...props }: CustomAvatarProps) => {
  if (imgUrl) {
    return <Avatar src={imgUrl} alt={name} sx={sx} {...props} />;
  }

  const initials = getInitials(name);
  const backgroundColor = stringToColor(name);

  return (
    <Avatar
      sx={{
        bgcolor: backgroundColor,
        color: '#fff',
        fontWeight: 500,
        fontSize: '1rem',
        ...sx,
      }}
      {...props}
    >
      {initials}
    </Avatar>
  );
};
