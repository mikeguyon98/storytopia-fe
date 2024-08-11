import Page from "../components/utils/Page";
import { ExploreTile } from "../components/ExploreTile";

const Explore = () => {
    return (
        <Page>
            <div className="text-xl font-bold py-8">Explore</div>
            <div className="flex flex-row flex-wrap gap-4">
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
                <ExploreTile image={"https://storage.googleapis.com/repurpose-ai.appspot.com/storytopia_images_dev/scene_1.png"}/>
            </div>
        </Page>
    );
}

export default Explore;