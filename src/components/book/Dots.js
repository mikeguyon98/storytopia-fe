const Dots = ({ imgIndex, setImgIndex }) => {
    return (
      <div className="mt-4 flex w-full justify-center gap-2">
        {imgs.map((_, idx) => {
          return (
            <button
              key={idx}
              onClick={() => setImgIndex(idx)}
              className={`h-3 w-3 rounded-full transition-colors ${
                idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
              }`}
            />
          );
        })}
      </div>
    );
  };