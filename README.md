# Binding Playground (Next.js)

An App Router-based Next.js prototype that visualizes the BCR-ABL tyrosine kinase bound to the drug **imatinib** (PDB `1OPJ`). The page uses [3Dmol.js](https://3dmol.csb.pitt.edu/) so you can rotate, zoom, and inspect the binding pocket right in the browser. Protein atoms are rendered as a spectrum cartoon and the ligand (`STI`) is highlighted using a stick representation plus a translucent surface.

## Development

```bash
npm install      # once
npm run dev      # http://localhost:3000

npm run build    # optional: production build
npm start        # run the production bundle locally
```

The viewer fetches coordinates from the RCSB PDB the first time it loads, so an internet connection is required on initial page load (subsequent loads are cached by the browser).

## Project structure

- `src/app/page.tsx` – client component with the 3Dmol viewer and explanatory copy.
- `src/app/page.module.css` – layout + viewer styling.
- `src/types/3dmol.d.ts` – minimal module declaration so TypeScript accepts the library.

## Next ideas

- Allow users to select other binder/target PDB entries or upload their own complex.
- Annotate residues that contact the ligand (hydrogen bonds, salt bridges, etc.).
- Overlay calculated properties (electrostatics, distances) to help medicinal chemists rationalize SAR.
