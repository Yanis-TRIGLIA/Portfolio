import React, { useEffect, useRef, useCallback } from "react";
import EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CustomImageTool from "./CustomImageTool";
// @ts-ignore
import Paragraph from '@editorjs/paragraph';
// @ts-ignore
import RawTool from '@editorjs/raw';
// @ts-ignore
import Button from '@ikbenbas/editorjs-button';

interface EditorJSProps {
  value?: OutputData;
  onChange: (data: OutputData) => void;
  onImageUpload: (file: File) => Promise<string>;
}

const EditorJSComponent: React.FC<EditorJSProps> = ({ value, onChange, onImageUpload }) => {
  const editorInstance = useRef<EditorJS | null>(null);
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const isInitialized = useRef(false);
  const currentValue = useRef<OutputData | undefined>(value);

  // Fonction pour nettoyer l'éditeur
  const destroyEditor = useCallback(() => {
    if (editorInstance.current) {
      try {
        editorInstance.current.destroy();
      } catch (error) {
        console.warn("Erreur lors de la destruction de l'éditeur:", error);
      } finally {
        editorInstance.current = null;
        isInitialized.current = false;
      }
    }
  }, []);

  // Fonction pour initialiser l'éditeur
  const initializeEditor = useCallback(async () => {
    if (!editorContainer.current || isInitialized.current) return;

    try {
      // S'assurer que le conteneur est vide
      editorContainer.current.innerHTML = '';

      const initialData = value || { blocks: [] };

      editorInstance.current = new EditorJS({
        holder: editorContainer.current,
        tools: {
          header: {
            class: Header as any,
            config: {
              levels: [1, 2, 3, 4],
              placeholder: 'Titre...',
            },
          },
          list: List as any,
          image: {
            class: CustomImageTool as any,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    console.log('Starting image upload:', file.name);
                    const url = await onImageUpload(file);
                    console.log('Image upload successful, URL:', url);
                    return {
                      success: 1,
                      file: { url },
                    };
                  } catch (error) {
                    console.error('Image upload failed:', error);
                    return {
                      success: 0,
                      error: {
                        message: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')
                      }
                    };
                  }
                },
              },

            }
          },
          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
            config: { placeholder: "Votre texte ici..." },
          },
          raw: RawTool as any,
          button: {
            class: Button as any,
            inlineToolbar: false,
          },
        },
        data: initialData,
        autofocus: false, // Éviter le focus automatique pour éviter les conflits
        placeholder: "Commencez à écrire votre article ici...",
        onChange: async () => {
          // Sauvegarde automatique à chaque changement
          if (editorInstance.current) {
            try {
              const savedData = await editorInstance.current.save();
              currentValue.current = savedData;
              onChange(savedData);
            } catch (error) {
              console.error("Erreur lors de la sauvegarde automatique:", error);
            }
          }
        },
      });

      // Attendre que l'éditeur soit prêt
      await editorInstance.current.isReady;
      isInitialized.current = true;

    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'éditeur:", error);
      isInitialized.current = false;
    }
  }, [value, onChange, onImageUpload]);

  // Effet pour gérer l'initialisation et la réinitialisation
  useEffect(() => {
    // Si la valeur a changé de manière significative (nouveau post ou changement de post)
    const hasValueChanged = JSON.stringify(currentValue.current) !== JSON.stringify(value);

    if (hasValueChanged || !isInitialized.current) {
      destroyEditor();
      currentValue.current = value;

      // Petit délai pour s'assurer que le DOM est nettoyé
      const timer = setTimeout(() => {
        initializeEditor();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [value, initializeEditor, destroyEditor]);

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      destroyEditor();
    };
  }, [destroyEditor]);



  return (
    <div className="w-full">
      <div
        ref={editorContainer}
        className="min-h-[200px] rounded-xl border border-gray-300 p-4 focus-within:border-blue-500 transition-colors"
        style={{ minHeight: '200px' }}
      />
      {/* La sauvegarde est maintenant automatique via l'événement onChange d'EditorJS */}
    </div>
  );
};

export default EditorJSComponent;