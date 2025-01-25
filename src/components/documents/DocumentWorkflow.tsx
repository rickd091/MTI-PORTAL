//src/components/documents/DocumentWorkflow.tsx
import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  WorkflowState, 
  WorkflowStep, 
  WorkflowEvent,
  UserRole,
  Document 
} from '../../types/core';

interface WorkflowSteps {
  [key: string]: WorkflowStep;
}

interface CommentInputProps {
  onSubmit: (comment: string) => void;
  placeholder?: string;
}

interface DocumentWorkflowProps {
  document: Document;
  currentState: WorkflowState;
  history: WorkflowEvent[];
  onStateChange: (newState: WorkflowState, comment?: string) => void;
  onCommentAdd: (event: Omit<WorkflowEvent, 'state'>) => void;
  allowComments?: boolean;
  userRole?: UserRole;
}

const workflowSteps: WorkflowSteps = {
  draft: {
    icon: Clock,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'Draft',
    allowedTransitions: ['submitted', 'deleted']
  },
  submitted: {
    icon: RefreshCw,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    label: 'Submitted',
    allowedTransitions: ['under_review', 'rejected']
  },
  under_review: {
    icon: RefreshCw,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    label: 'Under Review',
    allowedTransitions: ['approved', 'needs_revision', 'rejected']
  },
  needs_revision: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    label: 'Needs Revision',
    allowedTransitions: ['submitted']
  },
  approved: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    label: 'Approved',
    allowedTransitions: ['expired', 'revoked']
  },
  rejected: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    label: 'Rejected',
    allowedTransitions: ['deleted']
  },
  expired: {
    icon: Clock,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'Expired',
    allowedTransitions: ['submitted']
  },
  deleted: {
    icon: AlertCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'Deleted',
    allowedTransitions: []
  }
};

const CommentInput: React.FC<CommentInputProps> = ({ 
  onSubmit, 
  placeholder = "Add a comment..." 
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start space-x-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 min-h-[80px] p-2 border rounded-md text-sm"
          placeholder={placeholder}
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </form>
  );
};

const DocumentWorkflow: React.FC<DocumentWorkflowProps> = ({
  document,
  currentState,
  history = [],
  onStateChange,
  onCommentAdd,
  allowComments = true,
  userRole = 'viewer'
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const currentStep = workflowSteps[currentState];
  const StepIcon = currentStep?.icon || Clock;

  const handleStateChange = (newState: WorkflowState, comment: string = '') => {
    if (workflowSteps[currentState].allowedTransitions.includes(newState)) {
      onStateChange(newState, comment);
    }
  };

  const handleCommentSubmit = (comment: string) => {
    onCommentAdd({
      comment,
      timestamp: new Date().toISOString()
    });
    setShowCommentInput(false);
  };

  const canChangeState = userRole === 'admin' || userRole === 'reviewer';
  const canComment = allowComments && 
    (userRole === 'admin' || userRole === 'reviewer' || userRole === 'institution');

  return (
    <Card>
      <CardContent className="p-4">
        {/* Current State */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${currentStep?.bgColor}`}>
          <div className="flex items-center">
            <StepIcon className={`w-5 h-5 mr-2 ${currentStep?.color}`} />
            <span className={`font-medium ${currentStep?.color}`}>
              {currentStep?.label}
            </span>
          </div>
          {canComment && (
            <button
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="p-1 hover:bg-white/20 rounded"
              type="button"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Comment Input */}
        {showCommentInput && (
          <CommentInput onSubmit={handleCommentSubmit} />
        )}

        {/* Workflow History */}
        {history.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">History</h4>
            <div className="space-y-3">
              {history.map((event, index) => {
                const step = workflowSteps[event.state];
                const EventIcon = step?.icon || Clock;

                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <EventIcon className={`w-4 h-4 mt-0.5 ${step?.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{step?.label}</p>
                        <span className="text-xs text-gray-500">
                          {event.timestamp && new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.comment && (
                        <p className="text-gray-600 mt-1">{event.comment}</p>
                      )}
                      {event.user && (
                        <p className="text-xs text-gray-500 mt-1">
                          By: {event.user}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {canChangeState && workflowSteps[currentState].allowedTransitions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {workflowSteps[currentState].allowedTransitions.map(transition => {
                const transitionStep = workflowSteps[transition];
                return (
                  <button
                    key={transition}
                    onClick={() => handleStateChange(transition)}
                    className={`px-3 py-1 rounded-md text-sm text-white
                      ${transition === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                        transition === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                        'bg-blue-600 hover:bg-blue-700'}`}
                    type="button"
                  >
                    {transitionStep.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentWorkflow;