import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Page from "../components/utils/Page";
import { SplashButton } from "../components/buttons/SplashButton";
import SelectComponent from "../components/select/SelectComponent";
import axios from "axios";
import { useAuth } from "../AuthProvider";

const BASE_URL = "https://storytopia-fastapi-kgdwevjo6a-ue.a.run.app";

const Create = () => {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [storyPrompt, setStoryPrompt] = useState("");
  const [disabilities, setDisabilities] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [formError, setFormError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showDisabilityInput, setShowDisabilityInput] = useState(false);
  const { currentUser } = useAuth();

  const createStoryMutation = useMutation({
    mutationFn: async (storyData) => {
      const token = await currentUser.getIdToken();
      return axios.post(
        `${BASE_URL}/stories/generate-story-with-images`,
        storyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      setStoryPrompt("");
      setSelectedStyle("");
      setDisabilities("");
      setIsPrivate(false);
      setFormError("");
    },
    onError: () => {
      setSubmissionStatus(
        "An error occurred while processing your request. However, if the submission was received, you will still be notified via email once your story is ready."
      );
    },
  });

  const recommendationQuery = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      const token = await currentUser.getIdToken();
      const response = await axios.post(`${BASE_URL}/stories/recommendations`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: false,
  });

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    if (formError) setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setSubmissionStatus("");

    if (!storyPrompt.trim()) {
      setFormError("Please enter a story description.");
      return;
    }

    if (!selectedStyle) {
      setFormError("Please select a style for your story.");
      return;
    }

    setSubmissionStatus(
      "Your story generation request has been submitted. You will be notified via email once your story is ready."
    );

    createStoryMutation.mutate({
      prompt: storyPrompt,
      disabilities: disabilities,
      style: selectedStyle,
      private: isPrivate,
    });
  };

  const handleGetRecommendations = () => {
    if (currentUser) {
      setShowRecommendations(true);
      recommendationQuery.refetch();
    } else {
      setFormError("Please sign in to get recommendations.");
    }
  };

  const handleSelectRecommendation = (recommendation) => {
    setStoryPrompt(recommendation);
  };

  return (
    <Page>
      <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Create a Story
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm relative">
          {formError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{formError}</span>
            </div>
          )}
          {submissionStatus && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{submissionStatus}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="story"
                className="block text-sm font-medium leading-6 text-white"
              >
                Story Description
              </label>
              <div className="mt-2">
                <textarea
                  id="story"
                  name="story"
                  autoComplete="story"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 resize-y overflow-y-auto h-32"
                  placeholder="Enter your story description"
                  value={storyPrompt}
                  onChange={(e) => {
                    setStoryPrompt(e.target.value);
                    if (formError) setFormError("");
                  }}
                />
              </div>
            </div>

            <div>
              <SplashButton
                type="button"
                className="w-full"
                onClick={handleGetRecommendations}
              >
                Get Recommendations
              </SplashButton>
            </div>

            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium leading-6 text-white"
              >
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="private"
                  name="private"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <label
                  htmlFor="private"
                  className="ml-2 block text-sm text-white"
                >
                  Private
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowDisabilityInput(!showDisabilityInput)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                {showDisabilityInput ? "Hide Accessibility Options" : "Show Accessibility Options"}
              </button>
            </div>

            {showDisabilityInput && (
              <div>
                <label
                  htmlFor="disability"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Accessibility Options
                </label>
                <div className="mt-2">
                  <textarea
                    id="disability"
                    name="disability"
                    autoComplete="disability"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 resize-y overflow-y-auto h-16"
                    placeholder="Enter any consideration (e.g., color blindness, dyslexia) for tailored experience."
                    value={disabilities}
                    onChange={(e) => {
                      setDisabilities(e.target.value);
                      if (formError) setFormError("");
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <SplashButton
                type="submit"
                className="w-full"
                disabled={createStoryMutation.isLoading}
              >
                {createStoryMutation.isLoading ? "Submitting..." : "Submit"}
              </SplashButton>
            </div>
          </form>

          {/* Recommendations */}
          {showRecommendations && (
            <div className="absolute left-full top-0 ml-6 w-80">
              <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <h3 className="text-white font-semibold mb-3 text-lg">Recommendations:</h3>
                {recommendationQuery.isLoading ? (
                  <p className="text-white text-sm">Loading recommendations...</p>
                ) : recommendationQuery.isError ? (
                  <p className="text-red-500 text-sm">Error loading recommendations. Please try again.</p>
                ) : recommendationQuery.data ? (
                  <ul className="space-y-3">
                    {recommendationQuery.data.recommendation.split('\n').map((rec, index) => (
                      <li
                        key={index}
                        className="text-white text-sm cursor-pointer hover:text-indigo-400 transition-colors duration-200 bg-gray-700 p-2 rounded"
                        onClick={() => handleSelectRecommendation(rec.trim())}
                      >
                        {rec.trim()}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Create;