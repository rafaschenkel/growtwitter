import { useEffect, useState } from 'react';

interface RelativeTimestampProps {
  date: string;
  updateInterval?: number;
}

const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'agora';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `há ${diffInMinutes} min`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `há ${diffInHours} h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
    }

    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Data inválida';
  }
};

export const RelativeTimestamp = ({ date, updateInterval = 60000 }: RelativeTimestampProps) => {
  const [timestamp, setTimestamp] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    const updateTimestamp = () => {
      setTimestamp(formatRelativeTime(date));
    };

    const interval = setInterval(updateTimestamp, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return <span>{timestamp}</span>;
};
