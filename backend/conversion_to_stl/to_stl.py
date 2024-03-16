import vtk

class MeshProcessor:
    def __init__(self, input_file, output_file):
        """
        Initializes the mesh processor with input and output files.

        Args:
            input_file (str): Path to the input file in AMF, 3MF, PLY, or STEP format.
            output_file (str): Path to the output file in STL format.
        """
        # Create a reader based on the file format
        self.reader = self.create_reader(input_file)
        self.reader.SetFileName(input_file)
        self.reader.Update()

        # Apply the triangulation filter
        self.triangle_filter = vtk.vtkTriangleFilter()
        self.triangle_filter.SetInputConnection(self.reader.GetOutputPort())
        self.surface = self.triangle_filter.GetOutputPort()

        # Configure the normals filter
        self.normals_filter = vtk.vtkPolyDataNormals()
        self.configure_normals_filter()

        # Configure the fill holes filter
        self.fill_holes_filter = vtk.vtkFillHolesFilter()
        self.configure_fill_holes_filter()

        # Configure the STL writer
        self.writer = vtk.vtkSTLWriter()
        self.configure_stl_writer(output_file)

    def create_reader(self, input_file):
        """
        Creates a suitable VTK reader based on the input file extension.

        Args:
            input_file (str): Path to the input file.

        Returns:
            vtkAlgorithm: VTK reader specific to the file format.
        """
        extension = input_file.split('.')[-1].lower()
        if extension == 'ply':
            return vtk.vtkPLYReader()
        elif extension == 'step':
            return vtk.vtkSTLReader()
        elif extension == 'obj':
            return vtk.vtkOBJReader()
        elif extension == 'vtk':
            return vtk.vtkStructuredPointsReader()
        elif extension == 'xml':
            return vtk.vtkXMLPolyDataReader()
        elif extension == 'bmp':
            return vtk.vtkBMPReader()
        elif extension == 'dae':
            return vtk.vtkVRMLImporter()
        else:
            raise ValueError(f"Unsupported file format: {extension}")

    def configure_normals_filter(self):
        """
        Configures the normals filter with specific parameters.
        """
        self.normals_filter.SetAutoOrientNormals(False)
        self.normals_filter.SetFlipNormals(False)
        self.normals_filter.SetSplitting(False)
        self.normals_filter.SetFeatureAngle(30.0)
        self.normals_filter.ConsistencyOn()
        self.normals_filter.SetInputConnection(self.surface)
        self.surface = self.normals_filter.GetOutputPort()

    def configure_fill_holes_filter(self):
        """
        Configures the fill holes filter with a specific maximum hole size.
        """
        self.fill_holes_filter.SetHoleSize(1000.0)
        self.fill_holes_filter.SetInputConnection(self.surface)
        self.surface = self.fill_holes_filter.GetOutputPort()

    def configure_stl_writer(self, output_file):
        """
        Configures the STL writer with specific parameters.

        Args:
            output_file (str): Path to the output file in STL format.
        """
        self.writer.SetFileTypeToBinary()
        self.writer.SetInputConnection(self.surface)
        self.writer.SetFileName(output_file)

    def process_and_write(self):
        """
        Executes the mesh processing and writes the result to the STL file.
        """
        print('Processing and writing...')
        self.writer.Update()
        self.writer.Write()

