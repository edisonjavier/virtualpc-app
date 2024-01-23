export const toDataURL = (url: string): Promise<{ base64Url: string | ArrayBuffer | null }> => {
  const promise = new Promise<{ base64Url: string | ArrayBuffer | null }>((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onloadend = function () {
        resolve({ base64Url: reader.result });
      };
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });

  return promise;
};
