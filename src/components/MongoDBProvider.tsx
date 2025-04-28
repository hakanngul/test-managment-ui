import React, { useEffect, useState } from 'react';
import { connectToMongoDB } from '../services/mongodb';
import { Alert, Snackbar, CircularProgress, Box } from '@mui/material';

interface MongoDBProviderProps {
  children: React.ReactNode;
}

const MongoDBProvider: React.FC<MongoDBProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connect = async () => {
      try {
        setLoading(true);
        await connectToMongoDB();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        setError('Failed to connect to MongoDB. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    connect();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {children}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MongoDBProvider;
