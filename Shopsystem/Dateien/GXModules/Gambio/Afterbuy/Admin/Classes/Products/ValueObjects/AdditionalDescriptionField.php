<?php
/* --------------------------------------------------------------
   AdditionalDescriptionField.php 2022-11-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects;

class AdditionalDescriptionField
{
    private int    $FieldID;
    private string $FieldName;
    private string $FieldLabel;
    private string $FieldContent;
    
    
    public function __construct(int $FieldID, string $FieldName, string $FieldLabel, string $FieldContent)
    {
        
        $this->FieldID      = $FieldID;
        $this->FieldName    = $FieldName;
        $this->FieldLabel   = $FieldLabel;
        $this->FieldContent = $FieldContent;
    }
    
    
    public function toArray(): array
    {
        return [
            'FieldID'      => $this->FieldID,
            'FieldName'    => $this->FieldName,
            'FieldLabel'   => $this->FieldLabel,
            'FieldContent' => $this->FieldContent,
        ];
    }
    
    
    /**
     * @return int
     */
    public function getFieldID(): int
    {
        return $this->FieldID;
    }
    
    
    /**
     * @param int $FieldID
     */
    public function setFieldID(int $FieldID): void
    {
        $this->FieldID = $FieldID;
    }
    
    
    /**
     * @return string
     */
    public function getFieldName(): string
    {
        return $this->FieldName;
    }
    
    
    /**
     * @param string $FieldName
     */
    public function setFieldName(string $FieldName): void
    {
        $this->FieldName = $FieldName;
    }
    
    
    /**
     * @return string
     */
    public function getFieldLabel(): string
    {
        return $this->FieldLabel;
    }
    
    
    /**
     * @param string $FieldLabel
     */
    public function setFieldLabel(string $FieldLabel): void
    {
        $this->FieldLabel = $FieldLabel;
    }
    
    
    /**
     * @return string
     */
    public function getFieldContent(): string
    {
        return $this->FieldContent;
    }
    
    
    /**
     * @param string $FieldContent
     */
    public function setFieldContent(string $FieldContent): void
    {
        $this->FieldContent = $FieldContent;
    }
    
    
}