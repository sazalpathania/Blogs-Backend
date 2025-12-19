export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileData = {
      originalName: req.file.originalname,
      uploadedUrl: `${req.protocol}://${req.get("host")}/public/${
        req.file.filename
      }`,
    };

    const timestamp = new Date();

    return res.status(200).json({
      message: "File uploaded successfully",
      file: fileData,
      timestamp,
      test: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong during upload",
      error: error.message,
    });
  }
};
