'use client';

import { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa6';
import { uploadProfilePictureAction } from '@/actions/student-actions';

interface ProfilePictureProps {
    studentId: number;
    studentName: string;
    currentPicture?: string | null;
    canEdit: boolean;
}

export default function ProfilePicture({ studentId, studentName, currentPicture, canEdit }: ProfilePictureProps) {
    const [picture, setPicture] = useState(currentPicture || '');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initials = studentName
        ? studentName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPEG, PNG, etc.)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('photo', file);

        const result = await uploadProfilePictureAction(studentId, formData);

        if (result.success && result.profile_picture) {
            setPicture(result.profile_picture);
        } else {
            alert('Failed to upload: ' + (result.error || 'Unknown error'));
        }

        setUploading(false);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="relative group">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                {picture ? (
                    <img
                        src={picture}
                        alt={studentName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            {/* Upload Overlay */}
            {canEdit && (
                <>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all cursor-pointer"
                        title="Change profile picture"
                    >
                        <FaCamera className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    {uploading && (
                        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
