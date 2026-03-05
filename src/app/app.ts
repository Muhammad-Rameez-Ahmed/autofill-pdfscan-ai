import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GoogleGenAI, Type } from "@google/genai";

interface ExtractedData {
  numberOfColors: number;
  colorNames: string;
  height: number;
  width: number;
  stitches: number;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
    process: {
      env: {
        API_KEY?: string;
      };
    };
  }
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class App {
  isExtracting = signal(false);
  uploadStatus = signal<'idle' | 'uploading' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);
  rawJson = signal<string | null>(null);
  needsKey = signal(false);
 
  form = new FormGroup({
    numberOfColors: new FormControl<number | null>(null, [Validators.required]),
    colorNames: new FormControl('', [Validators.required]),
    height: new FormControl<number | null>(null),
    width: new FormControl<number | null>(null),
    stitches: new FormControl<number | null>(null),
  });

  async setupKey() {
    try {
      await window.aistudio.openSelectKey();
      this.needsKey.set(false);
      this.errorMessage.set(null);
    } catch (err) {
      console.error('Error opening key selector:', err);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Please upload a valid PDF file.');
      return;
    }

    this.errorMessage.set(null);
    this.isExtracting.set(true);
    this.uploadStatus.set('uploading');

    try {
      const base64Data = await this.fileToBase64(file);
      const extractedData = await this.extractDataWithAI(base64Data);
      
      if (extractedData) {
        this.form.patchValue(extractedData);
        this.rawJson.set(JSON.stringify(extractedData, null, 2));
        this.uploadStatus.set('success');
      } else {
        this.uploadStatus.set('error');
        this.errorMessage.set('Could not extract data from the PDF. Please fill manually.');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      this.uploadStatus.set('error');
      this.errorMessage.set('An error occurred during extraction. Please try again.');
    } finally {
      this.isExtracting.set(false);
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private async extractDataWithAI(base64Data: string): Promise<ExtractedData | null> {
    // Try to get the selected key first, then fallback to build-time key
    const apiKey = "AIzaSyCl6NvKzKraExBiZvdG3vFhwjcafMJqBTs";
    const ai = new GoogleGenAI({ apiKey });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Data
                }
              },
              {
                text: "Extract the following information from this PDF and return it as a JSON object: Number of Colors, Color Names, Height, Width, and Stitches. If a field is not found, return null for numbers or an empty string for text."
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              numberOfColors: { type: Type.NUMBER },
              colorNames: { type: Type.STRING },
              height: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              stitches: { type: Type.NUMBER }
            },
            required: ["numberOfColors", "colorNames"]
          }
        }
      });

      const text = response.text;
      if (text) {
        return JSON.parse(text) as ExtractedData;
      }
    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      const msg = (error as { message?: string }).message || '';
      if (msg.includes("not allowed") || msg.includes("entity was not found") || msg.includes("API_KEY_INVALID")) {
        this.needsKey.set(true);
        this.errorMessage.set("API Key issue detected. Please connect a valid API key.");
      }
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      alert('Form submitted successfully!');
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() {
    this.form.reset();
    this.uploadStatus.set('idle');
    this.errorMessage.set(null);
    this.rawJson.set(null);
  }
}
