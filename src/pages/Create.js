import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Page from "../components/utils/Page";
import { SplashButton } from "../components/buttons/SplashButton";
import SelectComponent from "../components/select/SelectComponent";
import { useAuth } from '../AuthProvider';  // Import the useAuth hook

const Create = () => {
    const { currentUser } = useAuth();  // Get the current user
    const [error, setError] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState("");
    const [storyDescription, setStoryDescription] = useState("");

    const createStory = async ({ prompt, style, isPrivate }) => {
        const response = await axios.post('http://localhost:8000/generate-story-with-images', {
            prompt,
            style,
            private: isPrivate,
        }, {
            headers: {
                Authorization: `Bearer ${currentUser.accessToken}`  // Add the Authorization header
            }
        });
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: createStory,
        onSuccess: (data) => {
            // Handle successful story creation, e.g., navigate to the story view page
            console.log('Story created successfully:', data);
        },
        onError: (error) => {
            setError('Failed to create story. Please try again.');
            console.error('Error creating story:', error);
        }
    });

    const handleStyleChange = (style) => {
        setSelectedStyle(style);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!storyDescription || !selectedStyle) {
            setError('Please provide a story description and choose a style.');
            return;
        }

        mutation.mutate({
            prompt: storyDescription,
            style: selectedStyle,
            isPrivate: false,  // Adjust based on your form if you allow setting privacy
        });
    };

    return (
        <Page>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Create a Story
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="story" className="block text-sm font-medium leading-6 text-white">
                                Story Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="story"
                                    name="story"
                                    autoComplete="story"
                                    required
                                    value={storyDescription}
                                    onChange={(e) => setStoryDescription(e.target.value)}
                                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 resize-y overflow-y-auto h-32"
                                    placeholder="Enter your story description"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="style" className="block text-sm font-medium leading-6 text-white">
                                Choose a Style
                            </label>
                            <div className="mt-2">
                                <SelectComponent
                                    options={["Comic", "Realistic", "Watercolor", "Surrealism"]}
                                    selectedValue={selectedStyle}
                                    onChange={handleStyleChange}
                                    placeholder="Select a style"
                                />
                            </div>
                        </div>
                        <div>
                            <SplashButton 
                                type="submit" 
                                className="w-full"
                                disabled={mutation.isLoading} // Optional: Show loading state
                            >
                                {mutation.isLoading ? 'Creating...' : 'Create Story'}
                            </SplashButton>
                        </div>
                    </form>
                </div>
            </div>
        </Page>
    );
}

export default Create;
