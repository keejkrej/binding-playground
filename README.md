# Binding Playground (Next.js)

An App Router-based Next.js prototype for exploring famous binder/target pairs (e.g., imatinib–BCR-ABL, N3–SARS-CoV-2 Mpro, carazolol–β2AR). The viewer uses [3Dmol.js](https://3dmol.csb.pitt.edu/) so you can rotate, zoom, and inspect each pocket. Proteins render as monochrome cartoons while ligands pop in bold sticks/spheres and a translucent surface.

## Development

```bash
npm install      # once
npm run dev      # http://localhost:3000

npm run build    # optional: production build
npm start        # run the production bundle locally
```

The viewer fetches coordinates from the RCSB PDB the first time it loads, so an internet connection is required on initial page load (subsequent loads are cached by the browser).

## Project structure

- `src/app/page.tsx` – client component with the 3Dmol viewer, dropdown logic, and explanatory copy.
- `src/app/page.module.css` – layout + viewer styling, including the selector controls.
- `src/types/3dmol.d.ts` – minimal module declaration so TypeScript accepts the library.

## Next ideas

- Support user-provided PDB IDs or uploads instead of the curated short list.
- Annotate residues that contact the ligand (hydrogen bonds, salt bridges, etc.).
- Overlay calculated properties (electrostatics, distances) to help medicinal chemists rationalize SAR.
