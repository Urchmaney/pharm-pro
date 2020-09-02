const { uploadImage } = require('../src/file_uploader/cloudinary_file_uploader');

it.skip('should return url string', async () => {
  const path = './uploads/profile_image.png';
  const result = await uploadImage({ path });
  expect(result).toBeDefined();
  expect(typeof result).toBe('string');
});