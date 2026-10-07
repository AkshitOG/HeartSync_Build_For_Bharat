import os
from pypdf import PdfReader

raw_dir = r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\data\raw"

def inspect_pdf(filename):
    path = os.path.join(raw_dir, filename)
    print("=" * 80)
    print(f"INSPECTING PDF: {filename}")
    print("=" * 80)
    reader = PdfReader(path)
    print(f"Total Pages: {len(reader.pages)}")
    full_text = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        print(f"\n--- PAGE {i+1} (Length: {len(text)}) ---")
        print(text[:1500])  # preview first 1500 chars of each page
        full_text.append(f"--- PAGE {i+1} ---\n" + text)
    
    out_txt = os.path.join(r"C:\Users\AKSHIT\desktop\Projects\Build For Bharat 2.0\DS\reports", filename.replace(".pdf", ".txt"))
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write("\n".join(full_text))
    print(f"\nWrote full extracted text to: {out_txt}")

if __name__ == "__main__":
    inspect_pdf("Data Description Doc.pdf")
    inspect_pdf("Problem Context Brief,  SAS VFL Demos, Guidelines Dos and Donts.pdf")
