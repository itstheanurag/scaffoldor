"use client";

import { useState, useEffect, useCallback } from "react";
import { FaTimes, FaCopy, FaCheck, FaInfoCircle } from "react-icons/fa";
import { schemaFields, exampleFile } from "../lib/schema-data";

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SchemaViewerModal({ isOpen, onClose }: SchemaViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"fields" | "example">("fields");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  const copyExample = async () => {
    await navigator.clipboard.writeText(JSON.stringify(exampleFile, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700 bg-neutral-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FaInfoCircle className="text-white text-sm" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Registry Schema
              </h2>
              <p className="text-xs text-neutral-400">
                Template structure for community contributions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-700">
          <button
            onClick={() => setActiveTab("fields")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "fields"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-neutral-800/50"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/30"
            }`}
          >
            Schema Fields
          </button>
          <button
            onClick={() => setActiveTab("example")}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "example"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-neutral-800/50"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/30"
            }`}
          >
            Example Template
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "fields" ? (
            <div className="space-y-4">
              {schemaFields.map((field) => (
                <div
                  key={field.name}
                  className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-neutral-700 text-emerald-400 rounded text-sm font-mono">
                        {field.name}
                      </code>
                      <span className="text-xs text-neutral-500">
                        {field.type}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        field.required
                          ? "bg-red-500/20 text-red-400"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {field.required ? "required" : "optional"}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 mb-2">
                    {field.description}
                  </p>
                  {field.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {field.options.map((option) => (
                        <span
                          key={option}
                          className="px-2 py-0.5 bg-neutral-700/50 text-neutral-300 text-xs rounded font-mono"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  )}
                  {field.example && (
                    <div className="mt-2 text-xs text-neutral-500">
                      <span className="text-neutral-500">Example: </span>
                      <code className="text-neutral-400">{field.example}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={copyExample}
                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <FaCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 border border-neutral-700 rounded-lg overflow-x-auto text-sm font-mono">
                <code className="text-neutral-300">
                  {JSON.stringify(exampleFile, null, 2)}
                </code>
              </pre>
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-sm text-emerald-300">
                  <strong>Tip:</strong> Copy this template and modify the values
                  to match your project. Make sure to use a unique{" "}
                  <code className="px-1.5 py-0.5 bg-emerald-500/20 rounded">
                    slug
                  </code>{" "}
                  that isn&apos;t already in the registry.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700 bg-neutral-900/95">
          <p className="text-sm text-neutral-400 text-center">
            Submit your template by creating{" "}
            <code className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded text-xs">
              content/templates/your-username/index.json
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
