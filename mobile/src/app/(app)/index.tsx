import HomeScreen from "@/src/screens/home/HomeScreen";
import HomeScreenMainLayout from "@/src/screens/home/layout/HomeScreenMainLayout";

export default function Index() {
    return (
        <HomeScreenMainLayout>
            <HomeScreen />
        </HomeScreenMainLayout>
    )
}