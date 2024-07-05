import Badges from "@/app/_components/main/badges";
const Footer = () => {
  return (
    <div className="bottom-0 mt-auto flex w-full gap-4 rounded-t-md bg-zinc-950 p-4 max-w-6xl">
      <div className="flex flex-row justify-between w-full">
        <div className="flex gap-4">
        <Badges
          link="https://github.com/gamerlord295"
          img="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png"
        />
        <Badges
            link="https://discord.gg/Y3VAJVdKWn"
            img="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
        />
        <Badges 
            link="https://www.instagram.com/gamerlord295"
            img="https://1000logos.net/wp-content/uploads/2017/02/insta-logo.png"
        />
        </div>
        <p className="opacity-75">
           Made by Gamerlord 
        </p>
      </div>
    </div>
  );
};

export default Footer;
 