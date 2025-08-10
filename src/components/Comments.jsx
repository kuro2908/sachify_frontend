import React, { useState, useEffect, memo, useRef } from "react";
import { Send, User, Star, MessageCircle, X } from "lucide-react";
import apiService from "../lib/ApiService";
import useAuthStore from "../store/authStore";
import { useToast } from "../contexts/ToastContext";

// ReplyForm component - completely independent with its own state
const ReplyForm = memo(({ 
  replyingTo, 
  onSubmit, 
  onCancel, 
  submitting 
}) => {
  const [replyContent, setReplyContent] = useState("");
  const textareaRef = useRef(null);

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    onSubmit(replyContent);
    setReplyContent("");
  };

  const handleCancel = () => {
    setReplyContent("");
    onCancel();
  };

  return (
    <div className="ml-8 mb-3">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">
            Trả lời <span className="font-medium">{replyingTo.username}</span>:
          </span>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <textarea
              ref={textareaRef}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Viết trả lời của bạn..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows="2"
              maxLength="300"
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || submitting}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 text-sm"
            >
              {submitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Gửi
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {replyContent.length}/300 ký tự
          </div>
        </form>
      </div>
    </div>
  );
});

ReplyForm.displayName = 'ReplyForm';

const Comments = ({ chapterId, storyId, type = "chapter" }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchComments();
  }, [chapterId, storyId, type]);

  const fetchComments = React.useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      if (type === "chapter") {
        response = await apiService.getChapterComments(chapterId);
        if (response.status === "success") {
          setComments(response.data.comments || []);
        }
      } else {
        // For story comments, fetch all chapter comments
        response = await apiService.getStory(storyId);
        if (response.status === "success") {
          const story = response.data.story;
          const allComments = [];
          
          // Fetch comments from all chapters
          if (story.chapters && story.chapters.length > 0) {
            for (const chapter of story.chapters) {
              try {
                const chapterCommentsResponse = await apiService.getChapterComments(chapter.id);
                if (chapterCommentsResponse.status === "success" && chapterCommentsResponse.data.comments) {
                  // Add chapter info to each comment
                  const commentsWithChapter = chapterCommentsResponse.data.comments.map(comment => ({
                    ...comment,
                    chapterTitle: chapter.title,
                    chapterNumber: chapter.chapterNumber
                  }));
                  allComments.push(...commentsWithChapter);
                }
              } catch (error) {
                console.error(`Error fetching comments for chapter ${chapter.id}:`, error);
              }
            }
          }
          
          // Sort comments by date (newest first)
          allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComments(allComments);
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      showError("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  }, [type, chapterId, storyId, showError]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated()) return;

    try {
      setSubmitting(true);
      let response;
      
      if (type === "chapter") {
        response = await apiService.postChapterComment(chapterId, {
          content: newComment.trim()
        });
      } else {
        response = await apiService.postReview(storyId, {
          rating: 5, // Default rating for story comments
          comment: newComment.trim()
        });
      }

      if (response.status === "success") {
        setNewComment("");
        showSuccess("Bình luận đã được đăng thành công!");
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      showError("Không thể đăng bình luận");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = React.useCallback((commentId, username) => {
    setReplyingTo({ id: commentId, username });
  }, []);

  const handleCancelReply = React.useCallback(() => {
    setReplyingTo(null);
  }, []);

  const handleSubmitReply = React.useCallback(async (content) => {
    if (!content.trim() || !isAuthenticated() || !replyingTo) return;

    try {
      setSubmittingReply(true);
      const response = await apiService.postChapterComment(chapterId, {
        content: content.trim(),
        parentCommentId: replyingTo.id
      });

      if (response.status === "success") {
        setReplyingTo(null);
        showSuccess("Trả lời đã được đăng thành công!");
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      showError("Không thể đăng trả lời");
    } finally {
      setSubmittingReply(false);
    }
  }, [isAuthenticated, replyingTo, chapterId, showSuccess, showError, fetchComments]);





  // CommentItem component - memoized to prevent re-renders
  const CommentItem = memo(({ comment, level = 0 }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    
    return (
      <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.user?.username || "Người dùng"}
                  </span>
                  {type === "story" && comment.chapterTitle && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {comment.chapterTitle}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
                
                {/* Reply button - only for chapter comments and not too deep */}
                {type === "chapter" && level < 2 && isAuthenticated() && (
                  <button
                    onClick={() => handleReply(comment.id, comment.user?.username)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <MessageCircle size={14} />
                    Trả lời
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reply form */}
        {replyingTo?.id === comment.id && (
          <ReplyForm
            replyingTo={replyingTo}
            onSubmit={handleSubmitReply}
            onCancel={handleCancelReply}
            submitting={submittingReply}
          />
        )}

        {/* Replies */}
        {hasReplies && (
          <div className="space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  });

  CommentItem.displayName = 'CommentItem';

  return (
    <div className="mt-8">
             <h3 className="text-lg font-semibold mb-4">
         {type === "chapter" ? "Bình luận chương" : "Tất cả bình luận truyện"}
       </h3>

             {/* Comment Form - Only show for chapter comments */}
       {type === "chapter" && (
         <>
           {isAuthenticated() ? (
             <form onSubmit={handleSubmitComment} className="mb-6">
               <div className="flex gap-3">
                 <div className="flex-1">
                   <textarea
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="Viết bình luận của bạn..."
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                     rows="3"
                     maxLength="500"
                   />
                   <div className="text-sm text-gray-500 mt-1">
                     {newComment.length}/500 ký tự
                   </div>
                 </div>
                 <button
                   type="submit"
                   disabled={!newComment.trim() || submitting}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                 >
                   {submitting ? (
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <Send size={16} />
                   )}
                   Đăng
                 </button>
               </div>
             </form>
           ) : (
             <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
               <p className="text-gray-600">
                 Vui lòng <a href="/login" className="text-blue-600 hover:underline">đăng nhập</a> để bình luận
               </p>
             </div>
           )}
         </>
       )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Đang tải bình luận...</p>
          </div>
                 ) : comments.length === 0 ? (
           <div className="text-center py-8 text-gray-500">
             {type === "chapter" 
               ? "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"
               : "Chưa có bình luận nào cho truyện này."
             }
           </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
