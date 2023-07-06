export default async function files(folder) {
  var context;
  var imageFile;
  switch (folder) {
    case 'portraits':
      context = import.meta.globEager("../assets/portraits/**/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'rakrakan-festival':
      context = import.meta.globEager("../assets/events/rakrakan-festival/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'still-life':
      context = import.meta.globEager("../assets/still-life/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'jakul':
      context = import.meta.globEager("../assets/events/jakul/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'showtime':
      context = import.meta.globEager("../assets/events/showtime/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'wowowin':
      context = import.meta.globEager("../assets/events/wowowin/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'nature':
      context = import.meta.globEager("../assets/nature/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'sports':
      context = import.meta.globEager("../assets/sports/*.{png,jpg,jpeg,svg,JPG,mp4}");
      break;
    case 'debug':
      imageFile = [
        {
          src: "https://picsum.photos/seed/20/1800/1200",
          width: 3,
          height: 2
        },
        {
          src: "https://picsum.photos/seed/88/1200/1800",
          width: 2,
          height: 3
        },
        {
          src: "https://picsum.photos/seed/19/1800/1200",
          width: 3,
          height: 2
        },
        {
          src: "https://picsum.photos/seed/18/1200/1800",
          width: 2,
          height: 3
        },
        {
          src: "https://picsum.photos/seed/99/1200/1800",
          width: 2,
          height: 3
        },
        {
          src: "https://picsum.photos/seed/21/1200/1800",
          width: 2,
          height: 3
        },
        {
          src: "https://picsum.photos/seed/100/1200/1800",
          width: 2,
          height: 3
        },
        {
          src: "https://picsum.photos/seed/128/1800/1200",
          width: 3,
          height: 2
        },
      ]
      return imageFile
    default:
      throw new Error("Not Found")
  }

  imageFile = await Promise.all(Object.values(context).map((image) => {
    if (/\.mp4$/.test(image.default)) {
      const vid = document.createElement("video");
      vid.src = image.default;
      return new Promise(resolve => {
        vid.addEventListener('loadedmetadata', () => {
          resolve({ src: image.default, fileType: "mp4", width: vid.videoWidth, height: vid.videoHeight })
        })
      });
    } else {
      const img = new Image();
      img.src = image.default;
      return new Promise(resolve => {
        img.onload = () => {
          resolve({ src: image.default, width: img.naturalWidth, height: img.naturalHeight })
        }
      });
    }
  }));

  imageFile.sort((a, b) => a.src.localeCompare(b.src)).reverse()

  return imageFile;
}


export async function loadAll() {
  const baseURL = "/src/assets"
  const context = await import.meta.globEager("../assets/**/*.{png,svg,jpg,JPG,jpeg,mp4}");
  const folders = {};

  function addFile(folderPath, file) {
    const isVid = /.*.mp4$/.test(file.default);
    const [folderName, ...subfolders] = folderPath.split('/');
    if (!folders[folderName]) {
      folders[folderName] = { name: folderName, files: [], folders: [] };
    }
    let currentFolder = folders[folderName];
    for (const subfolderName of subfolders) {
      let subfolder = currentFolder.folders.find(f => f.name === subfolderName);
      if (!subfolder) {
        subfolder = { name: subfolderName, files: [], folders: [] };
        currentFolder.folders.push(subfolder);
      }
      currentFolder = subfolder;
    }
    if (currentFolder.files?.length > 4) return
    currentFolder.files.push({
      src: file.default,
      fileType: isVid ? "mp4" : "jpg",
    });
  }

  Object.values(context).forEach((images) => {
    const folder = images.default.replace(new RegExp(`${baseURL}/\(.*\)/.*`), "$1");
    addFile(folder, images);
  });

  return Object.values(folders);
}


export async function importImages(path = null, range = 0) {
  const baseURL = "/src/assets"
  const context = await import.meta.globEager("../assets/**/*.{png,svg,jpg,JPG,jpeg,mp4}");
  const folders = [];

  async function addFile(folderPath, file, range) {
    const isVid = /.*.mp4$/.test(file.default);
    const [folderName, ...subfolders] = folderPath.split('/');
    if (!folders[folderName]) {
      folders[folderName] = { name: folderName, files: [], folders: [] };
    }
    let currentFolder = folders[folderName];
    for (const subfolderName of subfolders) {
      let subfolder = currentFolder.folders.find(f => f.name === subfolderName);
      if (!subfolder) {
        subfolder = { name: subfolderName, files: [], folders: [] };
        currentFolder.folders.push(subfolder);
      }
      currentFolder = subfolder;
      if (currentFolder.files.length > range) return
    }
    if (currentFolder.files.length >= range || isVid) return
    currentFolder.files.push({
      src: file.default,
    })
  }

  Object.values(context).forEach(async (images) => {
    if (path && !(new RegExp(`${baseURL}/${path}/.*`).test(images.default))) return
    const folder = images.default.replace(new RegExp(`${baseURL}/\(.*\)/.*`), "$1");
    await addFile(folder, images, range);
  });

  return folders
}
