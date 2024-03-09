from rest_framework_simplejwt.views import TokenObtainPairView

from tokens.serializer import CustomTokenObtainPairSerializer


# Create your views here.
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



