# Alphy Portfolio

Portfolio creativo en HTML, CSS y JavaScript.

## Abrir localmente

Abre `index.html` en tu navegador.

## Editar proyectos

1. En la web, pulsa `Editar proyectos`.
2. Agrega o modifica nombre, descripcion, tags, link y color.
3. Puedes agregar una imagen principal y una galeria usando URLs o rutas locales del repo.
4. Pulsa `Guardar`.

Los cambios del editor se guardan en tu navegador como borrador con `localStorage`.
La web publica lee el archivo `projects.json`.

## Exportar o importar

- `Exportar JSON` descarga tus proyectos actuales.
- `Importar JSON` vuelve a cargar un archivo exportado.
- `Restaurar ejemplo` recupera los proyectos de muestra.

## Publicar cambios de proyectos

1. Edita tus proyectos en la web.
2. Pulsa `Exportar JSON`.
3. Renombra el archivo exportado a `projects.json`.
4. Reemplaza `projects.json` en tu repo de GitHub.
5. Haz commit del cambio.

GitHub Pages publicara la nueva version automaticamente.

## Paginas individuales de proyecto

- Cada tarjeta abre `project.html?id=...`.
- Esa pagina lee `projects.json` y muestra nombre, descripcion, link e imagenes.
- `coverImage` sirve para la portada.
- `gallery` sirve para la galeria del proyecto.

## Donde poner las imagenes

Usa la carpeta `images/`.

- [images/README.md](C:/Users/juanz/Downloads/alphy-portfolio/images/README.md)
- `images/project-1/`
- `images/project-2/`
- `images/project-3/`

## Subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de esta carpeta.
3. Asegurate de que la rama principal se llame `main`.
4. En GitHub, ve a `Settings > Pages`.
5. En `Source`, selecciona `GitHub Actions`.
6. Haz push a `main`.

El workflow en `.github/workflows/deploy-pages.yml` publicara la web automaticamente.
