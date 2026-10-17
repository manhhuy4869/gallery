<?php
class Demo
{
    public $iF;
    public $tI;
    public function __construct($iF, $tI)
    {
        $this->iF = $iF;
        $this->tI = --$tI;
    }
}

$directory = getcwd() . '/';

$test = [];

foreach ((array)scandir($directory) as $value) {
    if (preg_match('/^(\.|\.\.|src|temp.*|in.*)$/', $value)) continue;
    $test[] = new Demo($value, count(glob($directory . $value . '/*')));
}

file_put_contents('./src/data.js', preg_replace(
    '/const lIF = \[.*?\];/',
    'const lIF = ' . json_encode($test, JSON_PRETTY_PRINT) . ';',
    file_get_contents('./src/data.js')
));

$changeNameFile = function ($value) use ($directory) {
    $folderPath = '';

    $files = array_diff(scandir($folderPath), array('.', '..'));

    $jpgFiles = array_filter($files, function ($file) {
        return strtolower(pathinfo($file, PATHINFO_EXTENSION)) === 'jpg';
    });

    usort($jpgFiles, function ($a, $b) {
        $nameA = pathinfo($a, PATHINFO_FILENAME);
        $nameB = pathinfo($b, PATHINFO_FILENAME);
        return strnatcmp($nameA, $nameB);
    });

    $count = 1;
    foreach ($jpgFiles as $file) {
        $newName = $count . '.jpg';
        rename($folderPath . '/' . $file, $folderPath . '/' . $newName);
        $count++;
    }
};

// $changeNameFile(1, 1);

// for ($i = 1; $i < 635; $i++) {
//     $imageData = file_get_contents("https://m2.imhentai.xxx/008/pv541jwzo7/$i.jpg");
//     file_put_contents($directory . "Baku Ane" . "/$i.jpg", $imageData);
// }
