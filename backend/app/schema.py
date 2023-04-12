from typing import List, Union
from pydantic import BaseModel


class ModelInput(BaseModel):
    drug1_conc: List[Union[float, int]]
    drug2_conc: List[Union[float, int]]
    effect: List[Union[float, int]]
    drug1_name: List[str]
    drug2_name: List[str]
