{ pkgs }: {
    deps = [
      pkgs.
        pkgs.yarn
        pkgs.esbuild
        # pkgs.nodejs-18_x
        pkgs.nodejs_20

        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
        pkgs.nodePackages.pnpm
    ];
}