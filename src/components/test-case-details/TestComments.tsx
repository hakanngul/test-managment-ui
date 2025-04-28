import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  LinearProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { Comment, mockComments } from '../../mock/testCommentsMock';

interface TestCommentsProps {
  testCaseId: string;
}

const TestComments: React.FC<TestCommentsProps> = ({ testCaseId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  useEffect(() => {
    // API'den veri çekme simülasyonu
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        // Gerçek uygulamada burada API çağrısı yapılacak
        setTimeout(() => {
          // Mock veri
          const commentsForCase = mockComments[testCaseId] || [];
          setComments(commentsForCase);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [testCaseId]);

  // Tarihi formatla
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Yeni yorum gönder
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    // Yeni yorum oluştur
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      testCaseId,
      content: newComment,
      author: 'Hakan Gül', // Gerçek uygulamada oturum açmış kullanıcıdan alınacak
      authorAvatar: 'https://i.pravatar.cc/150?img=1', // Gerçek uygulamada oturum açmış kullanıcıdan alınacak
      createdAt: new Date()
    };

    // Yorumları güncelle
    setComments([...comments, comment]);

    // Formu temizle
    setNewComment('');
  };

  // Yorum menüsünü aç
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, commentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  // Yorum menüsünü kapat
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  // Yorum düzenleme modunu aç
  const handleEditComment = () => {
    const comment = comments.find(c => c.id === selectedCommentId);
    if (comment) {
      setEditingComment(comment);
      setEditContent(comment.content);
    }
    handleCloseMenu();
  };

  // Yorum düzenlemeyi kaydet
  const handleSaveEdit = () => {
    if (!editingComment || !editContent.trim()) return;

    // Yorumları güncelle
    setComments(comments.map(comment =>
      comment.id === editingComment.id
        ? {
            ...comment,
            content: editContent,
            updatedAt: new Date()
          }
        : comment
    ));

    // Düzenleme modunu kapat
    setEditingComment(null);
    setEditContent('');
  };

  // Yorum düzenlemeyi iptal et
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  // Yorum silme modalını aç
  const handleDeletePrompt = () => {
    const comment = comments.find(c => c.id === selectedCommentId);
    if (comment) {
      setCommentToDelete(comment);
      setDeleteDialogOpen(true);
    }
    handleCloseMenu();
  };

  // Yorumu sil
  const handleDeleteComment = () => {
    if (!commentToDelete) return;

    // Yorumları güncelle
    setComments(comments.filter(comment => comment.id !== commentToDelete.id));

    // Modalı kapat
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  // Yorum silme modalını kapat
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Yorumlar
      </Typography>

      {isLoading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box>
          {/* Yorumlar Listesi */}
          {comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Bu test case için henüz yorum bulunmuyor.
            </Typography>
          ) : (
            <Box sx={{ mb: 4 }}>
              {comments.map((comment) => (
                <Card key={comment.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={comment.authorAvatar}
                        alt={comment.author}
                      >
                        {comment.author.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <IconButton
                        aria-label="comment-menu"
                        onClick={(e) => handleOpenMenu(e, comment.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={comment.author}
                    subheader={formatDate(comment.createdAt)}
                  />
                  <CardContent>
                    {editingComment && editingComment.id === comment.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                          >
                            İptal
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim()}
                          >
                            Kaydet
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        {comment.content}
                      </Typography>
                    )}

                    {comment.updatedAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Düzenlenme: {formatDate(comment.updatedAt)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Yeni Yorum Formu */}
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              src="https://i.pravatar.cc/150?img=1"
              alt="Hakan Gül"
            >
              H
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  Gönder
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Yorum Menüsü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditComment}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Düzenle
        </MenuItem>
        <MenuItem onClick={handleDeletePrompt}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Sil
        </MenuItem>
      </Menu>

      {/* Silme Onay Modalı */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          Yorumu Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>İptal</Button>
          <Button onClick={handleDeleteComment} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestComments;
